"""Generate the German static mirror with local translation models.

Requires beautifulsoup4, ctranslate2 and sentencepiece. Models stay outside the
repository. The resulting HTML and browser dictionary require no model at runtime.
"""
import argparse
from collections import defaultdict
import html
import json
import os
from pathlib import Path
import re
import runpy
import subprocess
from urllib.parse import quote, unquote, urljoin, urlsplit, urlunsplit
from xml.etree import ElementTree

from bs4 import BeautifulSoup, Comment, Doctype
import ctranslate2
import sentencepiece

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://www.waikwantent.com"
CHINESE = re.compile(r"[\u3400-\u9fff]")
TECHNICAL = re.compile(r"^(?:outputs/|google[a-f\d]+\.html$|index\.(?:original|wireframe)\.html$|test_)")
OPAQUE = re.compile(r"^(?:https?://|mailto:|[\w.+-]+@[\w.-]+\.[a-z]+$|[A-Z\d][A-Z\d.-]*(?:[/+×* ]+[A-Z\d.-]+)*$)")
GLOSSARY = {
    "Home": "Startseite", "Products": "Produkte", "Browse Products": "Produkte durchsuchen",
    "All Products": "Alle Produkte", "Product Center": "Produktübersicht",
    "Canopy Tents": "Faltzelte", "Flags & Poles": "Fahnen und Masten", "Display Systems": "Displaysysteme",
    "Light Boxes": "LED-Textilspannrahmen", "Accessories": "Zubehör",
    "Customer Service": "Kundenservice", "About Us": "Über uns", "Contact": "Kontakt",
    "Careers": "Karriere", "News & Resources": "Aktuelles und Ratgeber", "News": "Aktuelles",
    "Request a Quote": "Angebot anfragen", "Get Quote": "Angebot anfragen",
    "Get a Quote": "Angebot anfragen", "Send Inquiry": "Anfrage senden",
    "Search": "Suchen", "Filter": "Filtern", "Reset": "Zurücksetzen",
    "Specifications": "Technische Daten", "Downloads": "Downloads",
    "Privacy Policy": "Datenschutzerklärung", "Terms": "Geschäftsbedingungen",
    "English": "English", "中文": "简体中文", "简体中文": "简体中文",
    "WaiKwan": "WaiKwan", "FAQ": "FAQ", "WeChat": "WeChat", "WhatsApp": "WhatsApp",
    "Guangxi WaiKwan Tent Manufacturing Co., Ltd.": "Guangxi WaiKwan Tent Manufacturing Co., Ltd.",
    "Niujiaochong, Luchuan County, Yulin, Guangxi, China, 537609":
        "Niujiaochong, Kreis Luchuan, Yulin, Guangxi, China, 537609",
    "Download catalog": "Produktkatalog herunterladen (Originalsprache)",
    "Add to RFQ list": "Zur Anfrageliste hinzufügen",
    "Add to Cart": "Zur Anfrageliste hinzufügen",
    "Added to RFQ list": "Zur Anfrageliste hinzugefügt",
    "Product not found": "Produkt nicht gefunden",
    "Colour": "Farbe", "Color": "Farbe", "White": "Weiß", "Black": "Schwarz",
    "Custom canopy tents": "Individuell bedruckte Faltzelte",
    "Custom Canopy Tents": "Individuell bedruckte Faltzelte",
    "Custom Printed Canopy Tents": "Bedruckte Faltzelte",
    "Portable Display Systems": "Mobile Messesysteme",
    "Beach Flags": "Beachflags",
    "SEG Light Boxes": "LED-Textilspannrahmen",
    "Site Map": "Sitemap",
    "Do you offer samples?": "Bieten Sie Produktmuster an?",
    "What is your lead time?": "Wie lange dauert die Produktion?",
    "What is your MOQ (Minimum Order Quantity)?": "Wie hoch ist die Mindestbestellmenge?",
    "Search products": "Produkte suchen",
    "Tables / Chairs / Stools / Sanitation": "Tische, Stühle, Hocker und Sanitärausstattung",
    "40 Hexagon Frame Canopy Tent": "Faltzelt mit sechseckigem 40-mm-Gestell",
    "News & Guides": "Aktuelles und Ratgeber",
    "Download Product Catalog PDF": "Produktkatalog als PDF herunterladen (Originalsprache)",
    "Download PDF": "PDF herunterladen (Originalsprache)",
    "Fabric Banner Stand Series (WK-H-01 / WK-H-02)": "Textilbannerständer (WK-H-01 / WK-H-02)",
    "Transport & Storage System (WK-TFD-CASE)": "Transport- und Aufbewahrungssystem (WK-TFD-CASE)",
    "V Race Gate": "V-förmiges Renntor",
    "O Race Gate": "Rundes Renntor",
    "Backpack & Street / Display Flags": "Rucksackfahnen, Straßenfahnen und Werbefahnen",
    "Teardrop Beach Flag Poles (Fully Fiberglass)": "Glasfasermasten für tropfenförmige Beachflags",
    "Feather Beach Flag Poles (Fully Fiberglass)": "Glasfasermasten für federförmige Beachflags",
    "Aluminium Beach Flag Pole — Square": "Aluminiummast für rechteckige Beachflags",
    "Aluminium Beach Flag Pole — Feather/Teardrop": "Aluminiummast für feder- und tropfenförmige Beachflags",
    "Tent blade flag kit": "Beachflag-Set zur Zeltmontage",
    "Tent clamp / grip": "Befestigungsklemme für Faltzelte",
    "30/40 square frame connector": "Verbinder für 30/40-mm-Vierkantprofile",
    "40/50 diamond frame connector": "Verbinder für 40/50-mm-Rautenprofile",
    "Car Tent (WK-TENT188)": "Autozelt (WK-TENT188)",
    "上海国际广告展 · 2026年9月": "SIGN CHINA in Shanghai · September 2026",
    "与": "und", "或": "oder",
    "Valance logo print": "Logodruck auf dem Volant",
    "Full canopy print": "Vollflächiger Dachdruck",
    "Canopy + wall graphics": "Druck auf Dach und Seitenwänden",
    "Blank canopy": "Unbedrucktes Dach",
    "Powder-coated steel": "Pulverbeschichteter Stahl",
    "Custom Pantone color": "Pantone-Sonderfarbe",
    "Weights / sandbags": "Gewichte oder Sandsäcke",
    "2026年3月，伟群帐篷参加了在上海举办的 APPPEXPO 2026 展会，并在现场展示了公司一系列最新的展示与品牌宣传解决方案。这次展会为我们提供了一个与客户面对面交流、更加直观展示产品、并进一步加强与不同市场客户及合作伙伴联系的宝贵机会。":
        "Im März 2026 zeigte WaiKwan auf der APPPEXPO 2026 in Shanghai seine aktuellen Display- und Werbelösungen. Die Messe bot Gelegenheit, die Produkte vor Ort vorzuführen und sich mit Kunden und Partnern aus verschiedenen Märkten auszutauschen.",
    "展会新闻 · 2026年5月 · 广州": "Messebericht · Mai 2026 · Guangzhou",
    "展会 · 2026年3月 · 上海": "Messe · März 2026 · Shanghai",
    "2026年9月15–17日 · 上海新国际博览中心": "15.–17. September 2026 · Shanghai New International Expo Centre",
    "闭气式充气结构，充气完成后无需持续连接气泵。采用 400D（220g）PU 涂层涤纶布、0.3mm TPU 内胆，支持热升华全彩印刷，可选配电泵。":
        "Die luftdichte Konstruktion benötigt nach dem Aufpumpen keine dauerhaft angeschlossene Pumpe. Sie besteht aus PU-beschichtetem 400D-Polyester (220 g) und einer 0,3 mm starken TPU-Innenblase. Vollfarbiger Sublimationsdruck und eine elektrische Pumpe sind optional erhältlich.",
    "尺寸为 60 × 42 cm，可与充气椅组合布置洽谈及休息区。现场桌椅采用统一的品牌画面，与充气帐篷搭配，形成完整的接待空间。":
        "Der Tisch misst 60 × 42 cm und lässt sich mit aufblasbaren Stühlen als Besprechungs- oder Ruhebereich einsetzen. Die ausgestellten Möbel bildeten mit dem aufblasbaren Zelt und einheitlichem Markendruck einen Empfangsbereich.",
}
HEADINGS = {
    "index.html": "Bedruckte Faltzelte, Beachflags und Messesysteme direkt vom Hersteller",
    "about-us.html": "Über WaiKwan",
    "10x10-pop-up-canopy-tent.html": "10 × 10 ft Faltzelte für Händler und OEM-Aufträge",
    "advertising-light-box-manufacturer.html": "LED-Textilspannrahmen für Werbung und Präsentation",
    "aluminum-folding-tent.html": "Faltzeltgestelle aus Aluminium",
    "beach-flag-buying-guide.html": "Kaufratgeber für Beachflags",
    "beach-flag-supplier.html": "Beachflags mit Fahnenmasten und Standfüßen",
    "canopy-tent-buying-guide.html": "Kaufratgeber für Faltzelte",
    "canopy-tents.html": "Faltzelte für den gewerblichen Einsatz",
    "collections/accessories-parts.html": "Zubehör und Ersatzteile",
    "collections/display-systems.html": "Mobile Displaysysteme",
    "collections/flags-poles.html": "Fahnen und Masten",
    "collections/light-boxes.html": "LED-Textilspannrahmen",
    "contact-us.html": "Angebot für Faltzelte, Beachflags und Displays anfragen",
    "custom-canopy-tent-manufacturer.html": "Hersteller für individuell bedruckte Faltzelte",
    "custom-printed-canopy-tents.html": "Individuell bedruckte Faltzelte",
    "custom-printed-tent.html": "Bedruckte Faltzelte für gewerbliche Kunden",
    "event-canopy-tents.html": "Faltzelte für Messen, Märkte und Veranstaltungen",
    "event-tent-and-promotional-display.html": "Eventzelte und Werbedisplays direkt vom Hersteller",
    "export-loading.html": "Exportverpackung und Containerverladung im Werk",
    "faq.html": "Häufige Fragen zu Bestellung, Druck und Versand",
    "faq-artwork-files.html": "Welche Druckdaten benötigen Sie?",
    "faq-color-matching.html": "Wie stimmen Sie Druckfarben ab?",
    "faq-lead-time.html": "Wie lange dauert die Produktion?",
    "faq-moq.html": "Wie hoch ist die Mindestbestellmenge?",
    "flag-pole-and-base-manufacturer.html": "Fahnenmasten und Standfüße für Beachflags",
    "inflatable-tent-manufacturer.html": "Aufblasbare Zelte für Veranstaltungen und Werbung",
    "manufacturing-capabilities.html": "OEM- und ODM-Fertigung für Event- und Messesysteme",
    "pop-up-canopy-tent-manufacturer.html": "Hersteller für Faltzelte",
    "pop-up-canopy-tent-supplier.html": "Faltzelte für Veranstaltungen und Wiederverkauf",
    "pop-up-canopy-tent.html": "Faltzelte direkt vom Hersteller",
    "pop-up-canopy-tents.html": "Faltzelte",
    "pop-up-display-stands.html": "Mobile Pop-up-Displays",
    "portable-display-buying-guide.html": "Kaufratgeber für mobile Displaysysteme",
    "portable-display-systems.html": "Mobile Messesysteme für Händler und Messebauer",
    "privacy.html": "Datenschutzerklärung",
    "seg-light-box-manufacturer.html": "Hersteller für LED-Textilspannrahmen",
    "site-map.html": "Sitemap",
    "tension-fabric-backwall.html": "Textil-Messewände mit Spannrahmen",
    "terms.html": "Nutzungsbedingungen",
}
POLICY_COPY = {
    "Last updated: 2026-02-02": "Zuletzt aktualisiert am 2. Februar 2026",
    "1) What we collect": "1. Welche Daten wir erheben",
    "Inquiry info: name, email, product, quantity, target market, message (when you submit a quote request).":
        "Anfragedaten bei einer Angebotsanfrage: Name, E-Mail-Adresse, Produkt, Menge, Zielmarkt und Nachricht.",
    "Communication info: messages you send via email/WhatsApp/WeChat.":
        "Kommunikationsdaten: Nachrichten, die Sie per E-Mail, WhatsApp oder WeChat senden.",
    "Basic technical data: browser/device info and approximate location (standard server and security logs).":
        "Technische Basisdaten: Browser- und Geräteinformationen sowie ungefährer Standort in den üblichen Server- und Sicherheitsprotokollen.",
    "2) How we use information": "2. Wie wir die Daten verwenden",
    "To respond to inquiries and provide quotations, drawings, and order support.":
        "Zur Beantwortung von Anfragen und zur Bereitstellung von Angeboten, Zeichnungen und Unterstützung bei Bestellungen.",
    "To improve product recommendations and customer service.": "Zur Verbesserung unserer Produktempfehlungen und unseres Kundenservice.",
    "To prevent spam/fraud and maintain Site security.": "Zur Vermeidung von Spam und Betrug und zum Schutz der Website.",
    "3) Sharing": "3. Weitergabe von Daten",
    "We do not sell personal information. We may share information with:":
        "Wir verkaufen keine personenbezogenen Daten. Wir können Informationen an die folgenden Stellen weitergeben.",
    "Service providers used to operate communications and website infrastructure.":
        "Dienstleister für unsere Kommunikation und den Betrieb der Website.",
    "Shipping/forwarding partners when you request logistics quotes or place orders.":
        "Versand- und Speditionspartner bei einer Frachtanfrage oder Bestellung.",
    "Authorities if required by law.": "Behörden, soweit eine gesetzliche Pflicht besteht.",
    "4) International transfers": "4. Internationale Datenübermittlung",
    "We operate in China and serve global customers. Your information may be processed in different countries depending on communication and service providers.":
        "Wir sind in China tätig und betreuen Kunden weltweit. Je nach Kommunikationskanal und Dienstleister können Ihre Daten in verschiedenen Ländern verarbeitet werden.",
    "5) Data retention": "5. Aufbewahrung von Daten",
    "We keep inquiry records as needed for business communications, quotation history, and compliance, then delete or anonymize when no longer needed.":
        "Wir bewahren Anfragedaten auf, soweit dies für die Geschäftskommunikation, die Angebotshistorie oder gesetzliche Pflichten erforderlich ist. Danach löschen oder anonymisieren wir sie.",
    "6) Your choices": "6. Ihre Möglichkeiten",
    "You can request access, correction, or deletion of your information by contacting us.":
        "Sie können uns kontaktieren, um Auskunft, Berichtigung oder Löschung Ihrer Daten zu beantragen.",
    "You can opt out of non-essential marketing emails (if any) by replying or contacting us.":
        "Falls Sie Werbe-E-Mails erhalten, können Sie diese per Antwort auf die E-Mail oder durch eine Nachricht an uns abbestellen.",
    "7) Cookies": "7. Cookies und lokaler Speicher",
    "8) Contact": "8. Kontakt",
    "1) Website content": "1. Inhalte der Website",
    "Product photos, descriptions, specifications, and availability are for reference and may change.":
        "Produktfotos, Beschreibungen, technische Daten und Angaben zur Verfügbarkeit dienen der Orientierung und können sich ändern.",
    "Final product details are confirmed by quotation, proforma invoice, samples, and order confirmation.":
        "Die endgültigen Produktdetails ergeben sich aus dem Angebot, der Pro-forma-Rechnung, den Mustern und der Auftragsbestätigung.",
    "2) Quotes & orders": "2. Angebote und Bestellungen",
    "Quotes are subject to product configuration, printing, quantity, destination, and Incoterms.":
        "Angebote hängen von Produktausführung, Druck, Menge, Bestimmungsort und Incoterms ab.",
    "Lead time starts after confirming order details and artwork approval (and deposit/payment if applicable).":
        "Die Produktionsfrist beginnt nach Bestätigung der Auftragsdetails und Freigabe der Druckdaten sowie gegebenenfalls nach Eingang der Anzahlung oder Zahlung.",
    "3) Intellectual property": "3. Geistiges Eigentum",
    "The Site content (text, images, layout, logos) is owned by Guangxi WaiKwan Tent Manufacturing Co., Ltd or licensed to us.":
        "Die Inhalte der Website, darunter Texte, Bilder, Gestaltung und Logos, gehören Guangxi WaiKwan Tent Manufacturing Co., Ltd. oder werden von uns unter Lizenz genutzt.",
    "You may not copy, republish, or use our content for commercial purposes without permission.":
        "Das Kopieren, die erneute Veröffentlichung und die kommerzielle Nutzung unserer Inhalte bedürfen unserer Erlaubnis.",
    "4) Acceptable use": "4. Zulässige Nutzung",
    "Do not misuse the Site, attempt unauthorized access, or distribute malware.":
        "Missbrauchen Sie die Website nicht, versuchen Sie keinen unbefugten Zugriff und verbreiten Sie keine Schadsoftware.",
    "Do not submit false inquiry information or spam our forms.":
        "Machen Sie in Anfragen keine falschen Angaben und nutzen Sie unsere Formulare nicht für Spam.",
    "5) External links": "5. Externe Links",
    "Our Site may link to third-party websites (e.g., WhatsApp). We are not responsible for their content or policies.":
        "Unsere Website kann auf Angebote Dritter wie WhatsApp verweisen. Für deren Inhalte oder Richtlinien sind wir nicht verantwortlich.",
    "6) Disclaimer": "6. Bereitstellung der Website",
    "The Site is provided “as is”. We do not guarantee that the Site will be uninterrupted or error-free.":
        "Die Website wird in ihrem jeweiligen Zustand bereitgestellt. Wir garantieren keinen unterbrechungs- oder fehlerfreien Betrieb.",
    "7) Limitation of liability": "7. Haftungsbeschränkung",
    "To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the Site.":
        "Soweit gesetzlich zulässig, haften wir nicht für mittelbare Schäden, Begleitschäden oder Folgeschäden aus der Nutzung der Website.",
    "8) Changes": "8. Änderungen",
    "We may update these Terms from time to time by posting a new version on this page.":
        "Wir können diese Nutzungsbedingungen von Zeit zu Zeit aktualisieren und die neue Fassung auf dieser Seite veröffentlichen.",
    "9) Contact": "9. Kontakt",
}
GLOSSARY.update(POLICY_COPY)
SEO_HEADINGS = {
    "advertising-flag-pole-and-base-wholesale-supplier-b2b": "Werbefahnenmasten und Standfüße für den Großhandel",
    "aluminum-frame-fabric-display-manufacturer-custom-branding": "Textildisplays mit Aluminiumrahmen und individuellem Druck",
    "aluminum-frame-pop-up-tent-factory-direct-export": "Faltzelte mit Aluminiumgestell direkt vom Hersteller",
    "beach-flag-manufacturer-wholesale-feather-teardrop-flags": "Beachflags in Feder- und Tropfenform für den Großhandel",
    "branded-promotional-tent-supplier-b2b-bulk-orders": "Werbezelte mit Logo für B2B-Großbestellungen",
    "collapsible-display-system-wholesale-distributor-pricing": "Faltbare Displaysysteme für Wiederverkäufer",
    "commercial-grade-pop-up-canopy-wholesale-supplier": "Faltzelte für gewerbliche Wiederverkäufer",
    "custom-beach-flag-kit-supplier-for-agencies": "Bedruckte Beachflag-Sets für Werbeagenturen",
    "custom-canopy-tent-factory-for-reseller-programs": "Bedruckte Faltzelte für Wiederverkäufer und OEM-Aufträge",
    "custom-printed-canopy-tent-manufacturer-oem-china": "OEM-Fertigung für bedruckte Faltzelte in China",
    "custom-printed-feather-flag-supplier-bulk-order-oem": "Bedruckte Beachflags in Federform für Großbestellungen",
    "double-sided-beach-flag-manufacturer-export-quality": "Doppelseitig bedruckte Beachflags für den Export",
    "event-feather-flag-printing-manufacturer-factory-direct": "Beachflags in Federform für Veranstaltungen",
    "exhibition-tent-frame-and-fabric-manufacturer-odm": "ODM-Fertigung für Messezeltgestelle und Textilien",
    "fabric-tension-backwall-supplier-bulk-for-rental-companies": "Textil-Messewände für Vermieter und Großbesteller",
    "folding-event-tent-supplier-wholesale-moq": "Faltzelte für Veranstaltungen und Mindestbestellmengen",
    "heavy-duty-gazebo-tent-wholesale-manufacturer-europe-shipping": "Robuste Faltzelte im Großhandel mit Versand nach Europa",
    "modular-exhibition-display-hardware-manufacturer-odm": "Modulare Messedisplay-Komponenten aus ODM-Fertigung",
    "outdoor-advertising-tent-oem-supplier-custom-sizes": "Outdoor-Werbezelte in individuellen Größen",
    "outdoor-promotional-flag-system-manufacturer-oem": "Werbefahnensysteme für den Außeneinsatz",
    "pop-up-display-stand-wholesale-supplier-for-events": "Pop-up-Displays für Veranstaltungen im Großhandel",
    "portable-backdrop-display-system-supplier-wholesale": "Mobile Präsentationswände für den Großhandel",
    "portable-trade-show-booth-backdrop-manufacturer-export": "Mobile Messewände für Wiederverkäufer und den Export",
    "quick-setup-display-frame-supplier-oem-graphics": "Schnell montierbare Displayrahmen mit individuellem Druck",
    "replacement-beach-flag-pole-base-supplier-wholesale": "Ersatzmasten und Standfüße für Beachflags",
    "seg-fabric-light-box-manufacturer-b2b-custom-sizes": "LED-Textilspannrahmen in individuellen Größen",
    "teardrop-flag-hardware-supplier-for-print-shops": "Masten und Zubehör für Tropfenfahnen für Druckereien",
    "tension-fabric-display-wall-manufacturer-oem-trade-show": "Textil-Messewände aus OEM-Fertigung",
    "trade-show-canopy-tent-manufacturer-for-distributors": "Messe-Faltzelte für Wiederverkäufer",
    "wind-sail-banner-flag-wholesale-supplier-moq": "Windsegel-Werbefahnen im Großhandel",
}
TERMS = {
    "Pop-up-Kanopy-Zelte": "Faltzelte", "Pop Up Canopy Zelte": "Faltzelte",
    "Pop-up Canopy Zelt": "Faltzelt", "Pop Up Canopy Zelt": "Faltzelt",
    "Canopy Zelte": "Faltzelte", "Canopy Zelt": "Faltzelt",
    "Überdachungszelte": "Faltzelte", "Überdachungszelt": "Faltzelt",
    "Krondachzelte": "Faltzelte", "Baumzelt": "Faltzelt", "Strandflaggen": "Beachflags",
    "Strandfahnen": "Beachflags", "Strandflagge": "Beachflag",
    "Anzeigesysteme": "Displaysysteme", "Kaufführer": "Kaufratgeber",
    "Baldachinzelten": "Faltzelten", "Baldachzelten": "Faltzelten",
    "Baldachinzelte": "Faltzelte", "Baldachzelte": "Faltzelte",
    "Baldachinzelt": "Faltzelt", "Lichtboxen": "LED-Textilspannrahmen",
    "Kunstwerk": "Druckmotiv", "Kunstwerke": "Druckmotive",
    "Distributoren": "Händler", "Angebot Antwort": "Antwort auf Angebotsanfragen",
    "Messeanzeigesystem": "Messedisplay", "Zitate & Bestellungen": "Angebote und Bestellungen",
    "kundenindividuelle": "kundenspezifische",
}
ATTRS = {"alt", "aria-label", "placeholder", "title", "aria-description", "data-label"}
CONTENT_META = {
    "description", "og:title", "og:description", "twitter:title", "twitter:description", "keywords",
}
JSON_TEXT_KEYS = {"name", "headline", "description", "text", "articleBody", "caption", "alternateName", "keywords"}
RUNTIME = (
    "accessories-page", "all-products", "analytics", "cart",
    "dome-type", "flag-type", "flag-types", "furniture-type", "get-quote-footer", "main", "multilang",
    "product-center", "product-detail", "product-page", "products", "share-links", "six-sided-booth",
    "specifications-library", "standard-black-frame", "static-product-detail", "tent-type", "tent-types",
    "tents-details", "product-seo-map",
)
JS_STRING = re.compile(r""""((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'""")
HTML_FRAGMENT = re.compile(r">([^<>{}`]+)<")


def normalized(value):
    return " ".join(value.split())


def eligible(value):
    return value and (value in GLOSSARY or (
        len(value) <= 4500 and re.search(r"[A-Za-z\u3400-\u9fff]{2}", value)
        and not OPAQUE.fullmatch(value)
        and not re.fullmatch(r"[\d\W]*(?:cm|mm|kg|pcs|pc|gsm|m|ctn)[\d\W]*", value, re.I)
    ))


def git_sources():
    return subprocess.check_output(
        ["git", "ls-files", "-z", "--", "*.html"], cwd=ROOT
    ).decode("utf-8").rstrip("\0").split("\0")


def public_path(file):
    return {"index.html": "/", "zh/index.html": "/zh/"}.get(file, "/" + file)


def root_file(path):
    clean = unquote(path).lstrip("/")
    clean = clean.removeprefix("zh/")
    if clean == "zh":
        clean = ""
    return clean + ("index.html" if not clean or clean.endswith("/") else "")


def map_url(value, source, paths, *, absolute=False):
    if not value or value.startswith(("#", "mailto:", "tel:", "data:", "javascript:", "blob:")):
        return value
    url = urlsplit(urljoin(ORIGIN + source, value))
    if url.hostname not in {"www.waikwantent.com", "waikwantent.com"}:
        return value
    key = root_file(url.path)
    if key == "careers.html":
        path = "/zh/careers.html"
    elif key in paths:
        path = "/de" + public_path(key)
    else:
        path = url.path
        if path.startswith("/zh/") and not (ROOT / unquote(path).lstrip("/")).exists():
            candidate = path[3:]
            if (ROOT / unquote(candidate).lstrip("/")).exists():
                path = candidate
    path = quote(unquote(path), safe="/%:@!$&'()*+,;=-._~")
    return urlunsplit(("https" if absolute else "", "www.waikwantent.com" if absolute else "", path, url.query, url.fragment))


def translation_slots(soup):
    for item in soup.find_all(string=True):
        if isinstance(item, (Comment, Doctype)) or not item.parent:
            continue
        if item.parent.name not in {"script", "style", "svg", "code", "kbd"}:
            yield str(item), lambda value, node=item: node.replace_with(value)
    for tag in soup.find_all(True):
        if tag.name == "option" and "value" not in tag.attrs:
            tag["value"] = tag.get_text()
        for attribute in ATTRS & tag.attrs.keys():
            value = tag[attribute]
            if isinstance(value, str):
                yield value, lambda new, element=tag, key=attribute: element.__setitem__(key, new)
        if tag.name == "meta" and (tag.get("name") or tag.get("property")) in CONTENT_META:
            yield tag.get("content", ""), lambda new, element=tag: element.__setitem__("content", new)


def prepare_document(source, file, paths, indexable=None):
    soup = BeautifulSoup((ROOT / source).read_text(encoding="utf-8-sig"), "html.parser")
    if not soup.html or not soup.head or not soup.body:
        raise ValueError(f"Missing HTML structure in {source}")
    src_path = public_path(source)
    for item in soup.find_all(string=lambda value: isinstance(value, Comment)):
        if "Google Consent Mode default" in item or "Google Tag Manager" in item:
            item.extract()
    for tag in soup.find_all("script"):
        text = tag.get_text()
        if "googletagmanager.com/gtm.js" in text or "window.gtag('consent','default'" in text:
            tag.decompose()
            continue
        if not tag.get("src") and file in {"product-detail.html", "news/contact-us.html"}:
            text = text.replace("window.location.replace('/products/' + staticRoutes[sku] + '.html')",
                                "window.location.replace('/de/products/' + staticRoutes[sku] + '.html' + u.hash)")
            text = text.replace("window.location.replace('/contact-us.html'", "window.location.replace('/de/contact-us.html'")
            if text != tag.get_text():
                tag.string = text
    for tag in soup.find_all("noscript"):
        if tag.find("iframe", src=re.compile(r"googletagmanager\.com/ns\.html")):
            tag.decompose()
    if indexable is None:
        soup.head.insert(0, Comment(" German preview: no production tracking "))
    soup.html["lang"] = "de"
    for element in soup.select('[lang="zh-CN"]'):
        if element.name in {"article", "main", "section", "div"}:
            element["lang"] = "de"
    for tag in soup.select('link[rel="alternate"][hreflang]'):
        tag.decompose()
    for link in soup.select('#langMenu a[hreflang="de"]'):
        link.decompose()
    robots = soup.select_one('meta[name="robots"]')
    if robots is None:
        robots = soup.new_tag("meta", attrs={"name": "robots"})
        soup.head.append(robots)
    robots["content"] = (
        "index,follow,max-image-preview:large" if indexable and file in indexable else "noindex,follow"
    )
    for tag in soup.find_all(True):
        for attr in ("href", "src", "poster", "action", "data-src"):
            value = tag.get(attr)
            if not isinstance(value, str):
                continue
            if tag.name == "a" and tag.get("hreflang") in {"en", "zh-CN"}:
                continue
            absolute = tag.name == "link" and "canonical" in tag.get("rel", [])
            if tag.name == "link" and "sitemap" in tag.get("rel", []):
                continue
            tag[attr] = map_url(value, src_path, paths, absolute=absolute)
        for attr in ("srcset", "imagesrcset"):
            if attr in tag.attrs:
                options = (part.strip().split(maxsplit=1) for part in tag[attr].split(","))
                tag[attr] = ", ".join(" ".join([map_url(option[0], src_path, paths), *option[1:]])
                                      for option in options if option)
        if tag.name == "meta":
            key = tag.get("property") or tag.get("name")
            if key in {"og:url", "twitter:url"}:
                tag["content"] = ORIGIN + "/de" + public_path(file)
            if tag.get("http-equiv", "").lower() == "refresh":
                content = tag.get("content", "")
                if ";url=" in content.lower():
                    delay, target = re.split(";url=", content, maxsplit=1, flags=re.I)
                    tag["content"] = delay + ";url=" + map_url(target, src_path, paths)
    # Replace existing explicit language links that are ordinary anchors, such as on standalone product pages.
    for link in soup.select('a.lang-link[hreflang]'):
        language = link.get("hreflang")
        link["href"] = ("/zh" if language == "zh-CN" else "") + public_path(file)
    for button in soup.select('.lang-item[data-lang], #languageGate .language-options button[data-lang]'):
        language = button.get("data-lang")
        if language not in {"en", "zh"}:
            continue
        counterpart = ("zh/" if language == "zh" else "") + file
        if not (ROOT / counterpart).is_file():
            button.decompose()
            continue
        button.name = "a"
        button.attrs.pop("type", None)
        button["href"] = public_path(counterpart)
        button["hreflang"] = "zh-CN" if language == "zh" else "en"
    for language, counterpart in (("en", file), ("zh-CN", "zh/" + file)):
        if (ROOT / counterpart).is_file():
            soup.head.append(soup.new_tag("link", rel="alternate", hreflang=language,
                                         href=ORIGIN + public_path(counterpart)))
    if indexable and file in indexable:
        soup.head.append(soup.new_tag("link", rel="alternate", hreflang="de",
                                     href=ORIGIN + "/de" + public_path(file)))
        soup.head.append(soup.new_tag("link", rel="alternate", hreflang="x-default",
                                     href=ORIGIN + public_path(file)))
    return soup


def js_phrases(text):
    for match in JS_STRING.finditer(text):
        raw = next(item for item in match.groups() if item is not None)
        raw = raw.replace(r"\'", "'").replace(r'\"', '"').replace(r"\n", "\n")
        if "<" in raw and ">" in raw:
            yield from (normalized(n) for n in BeautifulSoup(raw, "html.parser").stripped_strings)
        elif (re.search(r"\s", raw) or CHINESE.search(raw) or raw[:1].isupper()) and not re.search(r"[/{}<>=$\\]", raw):
            yield normalized(raw)
    for phrase in HTML_FRAGMENT.findall(text):
        if not re.search(r"[/<>=$\\]", phrase):
            yield normalized(phrase)


def json_phrases(value, key=""):
    if isinstance(value, dict):
        for k, item in value.items():
            yield from json_phrases(item, k)
    elif isinstance(value, list):
        for item in value:
            yield from json_phrases(item, key)
    elif isinstance(value, str) and (key in JSON_TEXT_KEYS or CHINESE.search(value)):
        yield normalized(value)


def catalog_phrases():
    code = """
const fs = require('node:fs');
const vm = require('node:vm');
const context = {
    document: {
        head: { appendChild() {} },
        createElement() { return { textContent: '' }; },
        addEventListener() {},
    },
};
context.window = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync('scripts/products.js?v=20261112-inflatable-r1', 'utf8'), context);
console.log(JSON.stringify(vm.runInContext('new ProductManager().products', context).map(product =>
    [product.nameEn, product.descriptionEn].filter(Boolean))));
"""
    products = json.loads(subprocess.check_output(["node", "-e", code], cwd=ROOT, encoding="utf-8"))
    return {normalized(text) for values in products for text in values}


def jsonld_slots(soup):
    for tag in soup.select('script[type="application/ld+json"]'):
        try:
            yield tag, json.loads(tag.string or tag.get_text())
        except ValueError:
            continue


def rewrite_jsonld(value, translations, source, paths, key=""):
    if isinstance(value, list):
        return [rewrite_jsonld(item, translations, source, paths, key) for item in value]
    if isinstance(value, dict):
        return {k: rewrite_jsonld(item, translations, source, paths, k) for k, item in value.items()}
    if isinstance(value, str):
        if key in JSON_TEXT_KEYS:
            return translate(value, translations)
        if key == "inLanguage":
            return "de"
        if key in {"url", "item", "@id", "mainEntityOfPage"} and value.startswith(ORIGIN):
            # Keep cross-language organization and website identities shared.
            if value.endswith(("/#organization", "/#website")):
                return value
            return map_url(value, source, paths, absolute=True)
    return value


def parts(text, limit=260):
    chunks = []
    while len(text) > limit:
        boundary = max((m.end() for m in re.finditer(r"[.!?]\s+", text[:limit])), default=0)
        if boundary < limit // 3:
            boundary = text.rfind(" ", 0, limit)
        if boundary < 1:
            boundary = limit
        chunks.append(text[:boundary].strip())
        text = text[boundary:].strip()
    return chunks + [text]


def translate(value, translations):
    key = normalized(value)
    if key not in translations:
        return value
    leading = value[: len(value) - len(value.lstrip())]
    trailing = value[len(value.rstrip()):]
    return leading + translations[key] + trailing


def clean_translation(value, result):
    if value in GLOSSARY:
        return GLOSSARY[value]
    for original, preferred in TERMS.items():
        result = re.sub(r"(?<!\w)" + re.escape(original) + r"(?!\w)", preferred, result)
    # Keep technical quantities exact. A nonmatching segment needs separate review.
    if re.findall(r"\d+", value) != re.findall(r"\d+", result):
        if value.startswith("Model / configuration:"):
            labels = {
                "Model / configuration:": "Modell / Ausführung:",
                "Size:": "Größe:",
                "Material / construction:": "Material / Konstruktion:",
                "Listed weight / capacity (by configuration):": "Gewicht / Kapazität je Ausführung:",
                "Listed weight / capacity:": "Gewicht / Kapazität:",
                "Carton / packing details (source):": "Karton / Verpackungsangaben:",
                "Packing / weight details (source basis):": "Verpackung / Gewichtsangaben:",
                "Packing quantity:": "Stückzahl je Karton:",
                "Carton gross weight (kg):": "Bruttogewicht je Karton (kg):",
            }
            for label, german in labels.items():
                value = value.replace(label, german)
        return value
    return result


class LocalModel:
    def __init__(self, directory, language_pair):
        package = next(directory.glob("translate-" + language_pair + "*"))
        self.tokens = sentencepiece.SentencePieceProcessor(model_file=str(package / "sentencepiece.model"))
        self.engine = ctranslate2.Translator(
            str(package / "model"), compute_type="int8", inter_threads=2, intra_threads=2,
        )

    def batch(self, phrases):
        source = [self.tokens.encode(text, out_type=str) for text in phrases]
        result = self.engine.translate_batch(source, beam_size=2, max_batch_size=768, batch_type="tokens")
        return [self.tokens.decode(row.hypotheses[0]) for row in result]


def fill_translations(phrases, models, cache):
    translations = json.loads(cache.read_text(encoding="utf-8")) if cache.exists() else {}
    translations.update(GLOSSARY)
    groups = defaultdict(list)
    for value in sorted(phrases - translations.keys()):
        groups["zh_en" if CHINESE.search(value) else "en_de"].append(value)
    english_to_german = LocalModel(models, "en_de")
    for language in ("en_de", "zh_en"):
        group = groups[language]
        if not group:
            continue
        chinese_to_english = LocalModel(models, "zh_en") if language == "zh_en" else None
        for start in range(0, len(group), 192):
            batch = group[start:start + 192]
            split = [parts(value) for value in batch]
            flat = [chunk for chunks in split for chunk in chunks]
            if language == "zh_en":
                flat = chinese_to_english.batch(flat)
            result = iter(english_to_german.batch(flat))
            translations.update((value, " ".join(next(result) for _ in chunks))
                                for value, chunks in zip(batch, split))
            cache.write_text(json.dumps(translations, ensure_ascii=False), encoding="utf-8")
            print(f"{language}: {min(start + 192, len(group))}/{len(group)}", flush=True)
    return translations


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--models", type=Path, required=True)
    parser.add_argument("--cache", type=Path, required=True)
    parser.add_argument("--release", action="store_true", help="Enable the reviewed release and indexable routes.")
    args = parser.parse_args()
    sources = {}
    for file in sorted(git_sources(), key=lambda value: value.startswith("zh/")):
        if file.startswith("de/"):
            continue
        key = file.removeprefix("zh/")
        if not TECHNICAL.match(key) and key not in {"careers.html", "careers-submit-bridge.html"}:
            sources.setdefault(key, file)
    phrases = set()
    for file, source in sources.items():
        soup = prepare_document(source, file, sources)
        phrases.update(normalized(value) for value, _ in translation_slots(soup))
        for _, value in jsonld_slots(soup):
            phrases.update(json_phrases(value))
    dynamic = set()
    dynamic.update(catalog_phrases())
    for stem in RUNTIME:
        dynamic.update(js_phrases((ROOT / "scripts" / (stem + ".js")).read_text(encoding="utf-8")))
    runtime_json = json.loads((ROOT / "data/product-specifications-2026.json").read_text(encoding="utf-8"))
    def public_specs(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key not in {"source", "notesZh", "titleZh", "zh"}:
                    yield from public_specs(child)
        elif isinstance(value, list):
            for child in value:
                yield from public_specs(child)
        elif isinstance(value, str):
            yield normalized(value)
    dynamic.update(public_specs(runtime_json))
    phrases.update(dynamic)
    phrases = {value for value in phrases if eligible(value)}
    print(f"{len(sources)} source pages, {len(phrases)} translation segments", flush=True)
    translations = fill_translations(phrases, args.models, args.cache)
    translations = {source: clean_translation(source, result) for source, result in translations.items()}
    indexable = None
    production_tracking = None
    if args.release:
        locs = ElementTree.parse(ROOT / "sitemap.xml").findall(".//{*}loc")
        indexable = {root_file(urlsplit(loc.text).path) for loc in locs
                     if not urlsplit(loc.text).path.startswith(("/zh/", "/de/"))}
        production_tracking = runpy.run_path(str(ROOT / "scripts/apply-google-tag-manager.py"))["expected"]
    for file, source in sources.items():
        soup = prepare_document(source, file, sources, indexable)
        for value, setter in list(translation_slots(soup)):
            translated = translate(value, translations)
            if translated != value:
                setter(translated)
        for tag, value in jsonld_slots(soup):
            localized = rewrite_jsonld(value, translations, public_path(source), sources)
            tag.string = json.dumps(localized, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")
        heading_text = HEADINGS.get(file) or (SEO_HEADINGS.get(Path(file).stem) if file.startswith("seo/") else None)
        if heading_text:
            heading = soup.find("h1")
            if heading:
                heading.string = heading_text
            if soup.title:
                soup.title.string = heading_text + " | WaiKwan"
            for tag in soup.select('meta[property="og:title"], meta[name="twitter:title"]'):
                tag["content"] = heading_text + " | WaiKwan"
        for tag in soup.select('[data-translate], [data-i18n]'):
            if tag.get_text(strip=True):
                tag["data-de-static"] = ""
        script = soup.new_tag("script", src="/scripts/german-dictionary.js?v=20261112-inflatable-r1")
        script["defer"] = ""
        soup.head.insert(0, script)
        script = soup.new_tag("script", src="/scripts/german-localization.js")
        script["defer"] = ""
        soup.head.insert(1, script)
        soup.head.insert(0, "\n")
        target = ROOT / "de" / file
        target.parent.mkdir(parents=True, exist_ok=True)
        markup = str(soup)
        if production_tracking:
            markup = production_tracking(markup)
        target.write_text(markup, encoding="utf-8")
    # Keep all authored text in the build cache. The browser only needs the dynamic subset.
    payload = {
        key: translations[key] for key in sorted((dynamic | GLOSSARY.keys()) & translations.keys())
        if translations[key] != key and "\x00" not in key
    }
    paths = sorted({public_path(file) for file in sources} | {"/" + file for file in sources}
                   | {"/news/"})
    dictionary = "window.WK_DE_PATHS = " + json.dumps(paths, ensure_ascii=False) + ";\n"
    dictionary += "window.WK_DE_TEXT = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n"
    (ROOT / "scripts/german-dictionary.js?v=20261112-inflatable-r1").write_text(dictionary, encoding="utf-8")
    (ROOT / "de/locale-map.json").write_text(json.dumps({
        "enabled": args.release,
        "paths": paths,
    }, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Generated {len(sources)} German pages and {len(payload)} runtime translations.")


if __name__ == "__main__":
    main()
