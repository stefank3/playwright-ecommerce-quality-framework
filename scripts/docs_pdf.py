"""Render the canonical workbook to a reproducible, local A4 PDF.

Inputs: fixed Markdown workbook and pinned Python packages. Output: its sibling
PDF, replaced atomically only after validation. Side effects: a temporary sibling
file during generation; no network, subprocesses, or test execution. Known
unsupported Markdown, unsafe paths, dependency drift, or invalid navigation fail.
The documented subset is not a complete Markdown grammar. Handled failures remove
temporary output; abrupt termination cannot guarantee cleanup.
"""

from functools import partial
from hashlib import sha256
from html import escape
from importlib.metadata import version
from pathlib import Path
import re
import sys
import tempfile

import reportlab
from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageBreak, PageTemplate, Paragraph,
    Preformatted, Spacer, Table, TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents

ROOT = Path(__file__).resolve().parent.parent
GUIDE = ROOT / "guide"
SOURCE = GUIDE / "Playwright-Ecommerce-Quality-Framework-Guide.md"
OUTPUT = SOURCE.with_suffix(".pdf")
INK = colors.HexColor("#172F45")
TEAL = colors.HexColor("#007E87")
WIDTH = A4[0] - 100


def check_environment():
    """Require pinned packages and ordinary repository-local input/output paths."""
    if GUIDE.is_symlink() or GUIDE.resolve() != GUIDE:
        raise ValueError("Guide directory must be a real repository-local directory.")
    for path in (SOURCE, OUTPUT, GUIDE / "requirements.txt"):
        if path.is_symlink():
            raise ValueError("Guide inputs and output must not be links.")
    for line in (GUIDE / "requirements.txt").read_text(encoding="utf-8").splitlines():
        if line and not line.startswith("#"):
            name, pinned = line.split("==")
            if version(name) != pinned:
                raise ValueError(f"Install the pinned guide requirements: {name} differs.")


def styles():
    """Use bundled Vera for prose/headings and standard PDF fonts for code/bullets."""
    directory = Path(reportlab.__file__).parent / "fonts"
    for name, filename in (("Vera", "Vera.ttf"), ("VeraBold", "VeraBd.ttf"),
                           ("VeraItalic", "VeraIt.ttf"), ("VeraBI", "VeraBI.ttf")):
        pdfmetrics.registerFont(TTFont(name, str(directory / filename)))
    pdfmetrics.registerFontFamily("Vera", normal="Vera", bold="VeraBold",
                                  italic="VeraItalic", boldItalic="VeraBI")
    body = ParagraphStyle("Body", fontName="Vera", fontSize=10, leading=15,
                          textColor=INK, spaceAfter=9, splitLongWords=True)
    return {
        "body": body,
        "title": ParagraphStyle("Title", parent=body, fontName="VeraBold",
                                fontSize=27, leading=34, spaceAfter=24),
        "chapter": ParagraphStyle("Chapter", parent=body, fontName="VeraBold",
                                  fontSize=19, leading=25, spaceAfter=18),
        "section": ParagraphStyle("Section", parent=body, fontName="VeraBold",
                                  fontSize=11, leading=16, textColor=TEAL,
                                  spaceBefore=10, spaceAfter=7, keepWithNext=True),
        "code": ParagraphStyle("Code", fontName="Courier", fontSize=9,
                               leading=12, textColor=INK, backColor=colors.HexColor("#EEF3F6"),
                               borderPadding=9, spaceBefore=7, spaceAfter=14),
        "cell": ParagraphStyle("Cell", parent=body, fontSize=8.3, leading=12,
                               spaceAfter=0),
        "toc": ParagraphStyle("Contents", parent=body, fontSize=9, leading=12,
                              spaceBefore=0, spaceAfter=0),
    }


def inline(text):
    """Escape Markdown text and render the supported inline code/emphasis subset."""
    parts = re.split(r"(`[^`]+`)", text)
    rendered = []
    for part in parts:
        if part.startswith("`") and part.endswith("`"):
            rendered.append('<font name="Courier">' + escape(part[1:-1]) + '</font>')
        else:
            plain = re.sub(r"\*\*[^*]+\*\*", "", part)
            if re.search(r"!\[|\]\(|<[^>]+>|(?<!\*)\*(?!\*)|(?<!\w)_[^_]+_", plain):
                raise ValueError("Unsupported inline Markdown; see docs/extending.md.")
            safe = escape(part)
            safe = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", safe)
            rendered.append(safe)
    return "".join(rendered)


def footer(canvas, document):
    """Draw fixed running furniture and a page number on every A4 page."""
    canvas.saveState()
    canvas.setStrokeColor(TEAL)
    canvas.line(50, 44, A4[0] - 50, 44)
    canvas.setFont("Vera", 8)
    canvas.setFillColor(INK)
    canvas.drawString(50, 29, "PLAYWRIGHT ECOMMERCE / STUDY WORKBOOK")
    canvas.drawRightString(A4[0] - 50, 29, str(document.page))
    canvas.restoreState()


class WorkbookDocument(BaseDocTemplate):
    """Collect chapter destinations for the multi-pass TOC and PDF outline."""

    def afterFlowable(self, flowable):
        """Record a rendered chapter's physical page and clickable destination."""
        key = getattr(flowable, "bookmark", None)
        if key:
            title = flowable.getPlainText()
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(title, key, level=0, closed=False)
            self.notify("TOCEntry", (0, title, self.page, key))


def make_table(lines, theme):
    """Convert a simple pipe table into wrapping cells with a repeated header."""
    rows = [[cell.strip() for cell in line.strip().strip("|").split("|")]
            for line in lines]
    if len(rows) < 2 or not all(re.fullmatch(r":?-+:?", cell) for cell in rows[1]):
        raise ValueError("Table requires a Markdown separator row.")
    rows.pop(1)
    columns = len(rows[0])
    if any(len(row) != columns for row in rows):
        raise ValueError("Table rows have inconsistent column counts.")
    data = [[Paragraph(inline(cell), theme["cell"]) for cell in row] for row in rows]
    table = Table(data, colWidths=[WIDTH / columns] * columns, repeatRows=1,
                  hAlign="LEFT", spaceBefore=6, spaceAfter=13)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#DCEBED")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F4F7F9")]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return table


def story_from_markdown(markdown, theme):
    """Render the documented subset after known checks, not a full Markdown grammar."""
    reject_known_unsupported(markdown)
    lines = markdown.splitlines()
    story = []
    index = 0
    chapters = 0
    while index < len(lines):
        line = lines[index]
        index += 1
        if not line.strip():
            continue
        if line.startswith((" ", "\t", ">", "####")):
            raise ValueError("Nested blocks and additional heading levels are unsupported.")
        if line.startswith("# "):
            story.extend([Spacer(1, 55), Paragraph(inline(line[2:]), theme["title"])])
        elif line.startswith("## "):
            if not chapters:
                story.extend([PageBreak(), Paragraph("Contents", theme["chapter"])])
                toc = TableOfContents()
                toc.levelStyles = [theme["toc"]]
                story.append(toc)
            story.append(PageBreak())
            chapters += 1
            heading = Paragraph(inline(line[3:]), theme["chapter"])
            heading.bookmark = f"chapter-{chapters}"
            story.append(heading)
        elif line.startswith("### "):
            story.append(Paragraph(inline(line[4:]), theme["section"]))
        elif line.startswith("```"):
            block = []
            while index < len(lines) and lines[index] != "```":
                value = lines[index]
                if not value.isascii() or pdfmetrics.stringWidth(value, "Courier", 9) > WIDTH - 20:
                    raise ValueError("Code must be ASCII and fit the printable width.")
                block.append(value)
                index += 1
            if index == len(lines):
                raise ValueError("Unclosed code fence.")
            index += 1
            story.append(Preformatted("\n".join(block), theme["code"]))
        elif line.startswith("|"):
            table_lines = [line]
            while index < len(lines) and lines[index].startswith("|"):
                table_lines.append(lines[index])
                index += 1
            story.append(make_table(table_lines, theme))
        elif re.match(r"^(?:- |\d+\. )", line):
            marker, value = line.split(" ", 1)
            story.append(Paragraph(inline(value), theme["body"], bulletText=marker))
        else:
            paragraph = [line]
            while index < len(lines) and lines[index].strip():
                if re.match(r"^(#|```|\||- |\d+\. )", lines[index]):
                    break
                paragraph.append(lines[index])
                index += 1
            value = " ".join(paragraph)
            if re.search(r"^>|\*{3}|^#{4}", value):
                raise ValueError("Unsupported Markdown; use the workbook subset in docs/extending.md.")
            story.append(Paragraph(inline(value), theme["body"]))
    if chapters != 30:
        raise ValueError("Expected exactly 30 numbered workbook lessons.")
    return story


def reject_known_unsupported(markdown):
    """Reject known unsupported blocks outside fences and strike syntax outside code."""
    fenced = False
    for number, line in enumerate(markdown.splitlines(), 1):
        if line.startswith("```"):
            fenced = not fenced
            continue
        if fenced:
            continue
        plain = re.sub(r"`[^`]+`", "", line)
        if (
            line.startswith((" ", "\t", ">", "####"))
            or re.fullmatch(r"(?:=+|-+)\s*", line)
            or re.fullmatch(r"(?:\*\s*){3,}|(?:_\s*){3,}|(?:-\s*){3,}", line)
            or re.match(r"^(?:\+\s|\d+\)\s|\[[^\]]+\]:)", line)
            or "~~" in plain
        ):
            raise ValueError(f"Known unsupported Markdown at line {number}; see docs/extending.md.")


def verify_pdf(path, digest):
    """Check A4 pages, extractable text, 30 valid chapter destinations and build hash."""
    reader = PdfReader(path)
    if not 25 <= len(reader.pages) <= 40:
        raise ValueError("Workbook must contain 25-40 useful pages.")
    if len(reader.outline) != 30:
        raise ValueError("Missing chapter bookmarks.")
    for destination in reader.outline:
        number = reader.get_destination_page_number(destination)
        if number is None or not 0 <= number < len(reader.pages):
            raise ValueError("Unresolvable chapter bookmark.")
    for page in reader.pages:
        if any(abs(float(actual) - expected) > 1 for actual, expected in
               zip((page.mediabox.width, page.mediabox.height), A4)):
            raise ValueError("Page is not A4.")
        if not (page.extract_text() or "").strip():
            raise ValueError("Page has no extractable text.")
    if reader.metadata.subject != f"Guide build SHA-256: {digest}":
        raise ValueError("Source fingerprint mismatch.")
    return len(reader.pages)


def main():
    """Replace output only after validation; clean temporary files on handled failures."""
    if len(sys.argv) != 1:
        raise ValueError("Usage: python scripts/docs_pdf.py (no arguments).")
    check_environment()
    source = SOURCE.read_bytes()
    digest = sha256(source + Path(__file__).read_bytes()
                    + (GUIDE / "requirements.txt").read_bytes()).hexdigest()
    theme = styles()
    story = story_from_markdown(source.decode("utf-8"), theme)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=GUIDE, suffix=".pdf.tmp", delete=False) as handle:
            temporary = Path(handle.name)
        document = WorkbookDocument(str(temporary), pagesize=A4, invariant=1, leftMargin=50,
                                    rightMargin=50, topMargin=48, bottomMargin=62,
                                    title="Playwright Ecommerce Quality Framework: Study Workbook",
                                    author="Stefan Kajchevski", subject=f"Guide build SHA-256: {digest}")
        frame = Frame(50, 62, WIDTH, A4[1] - 110, leftPadding=0, rightPadding=0,
                      topPadding=0, bottomPadding=0)
        document.addPageTemplates(PageTemplate(id="workbook", frames=frame, onPage=footer))
        document.multiBuild(story, canvasmaker=partial(Canvas, invariant=1, pageCompression=1))
        pages = verify_pdf(temporary, digest)
        temporary.replace(OUTPUT)
        print(f"PDF OK: {pages} A4 pages, 30 bookmarks; SHA-256 {sha256(OUTPUT.read_bytes()).hexdigest()}")
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
