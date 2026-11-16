import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Palette
    c_bg = RGBColor(11, 19, 43)        # Deep space dark navy #0B132B
    c_card = RGBColor(26, 38, 70)      # Elevated card dark blue #1A2646
    c_white = RGBColor(248, 250, 252)  # #F8FAFC
    c_cyan = RGBColor(56, 189, 248)    # Cyan #38BDF8
    c_orange = RGBColor(249, 115, 22)  # Safety Orange #F97316
    c_muted = RGBColor(148, 163, 184)  # Slate 400 #94A3B8
    c_border = RGBColor(51, 65, 85)    # Slate 700

    slides_data = [
        # Slide 1: Title
        {
            "tag": "NASA SPACE APPS CHALLENGE 2026",
            "title": "Project Pyrosage",
            "subtitle": "Super Intelligence Fire Safety Platform for Human Space Exploration",
            "bullets": [
                "Challenge: Flame in Freefall (Microgravity Combustion Data)",
                "Unified analysis of 24 NASA PSI flight and ground investigations",
                "Actionable fire prevention, detection, and suppression for Moon and Mars"
            ],
            "footer": "Engineered according to the Lauren Tan Inverted Trust Pyramid | 100% Verified",
            "notes": "Welcome judges. Today we present Project Pyrosage, an SI-powered combustion intelligence platform built for the NASA Space Apps 'Flame in Freefall' challenge. We translate over 30 years and 12 terabytes of microgravity flight data into operational safety constraints for Artemis and deep-space missions."
        },
        # Slide 2: The Challenge & Physics
        {
            "tag": "THE CORE PROBLEM",
            "title": "Fire in Freefall: The Physics of Microgravity",
            "subtitle": "Without buoyancy-driven convection, combustion rules change completely",
            "cards": [
                ("Ghostly Spherical Flames", "Absence of natural buoyancy eliminates the flickering teardrop shape. Flames form cool, spherical diffusion shells reliant on forced HVAC ventilation."),
                ("Exploration Hazards", "Upcoming exploration architectures (such as Lunar Moon Base at 32% O2 and EVA suits at 100% O2) produce hyperoxic conditions where conventional materials burn violently."),
                ("The 12.3 TB Data Bottleneck", "Over 24 investigations in NASA's Physical Science Informatics repository are historically isolated, making cross-investigation comparison and risk modeling difficult.")
            ],
            "notes": "When gravity is removed, fire behaves completely differently. Natural convection disappears, so hot gases do not rise. Flames become spherical, slow-burning, and hard to detect. Compounding this, planned lunar and Mars habitats feature elevated oxygen levels, turning normally flame-retardant materials into severe fire hazards."
        },
        # Slide 3: Engineering Architecture
        {
            "tag": "ZERO-SLOP ENGINEERING",
            "title": "Architecture: The Inverted Trust Pyramid",
            "subtitle": "Eliminating AI hallucinations through deterministic code constraints",
            "cards": [
                ("TypeScript Strict Mode", "Strict compile-time types with zero implicit any. Impossible states and malformed scientific fields are unrepresentable at build time."),
                ("Zod Schema Boundary Checks", "Runtime validation of all 24 PSI investigations and 2,009 experimental runs against strict physical schemas before rendering."),
                ("Automated Verification Stack", "Continuous Vitest test suites executing combustion physics models and generating deterministic verification artifacts (dist/verification-report.json).")
            ],
            "notes": "Rather than relying on loosely prompted AI outputs, Pyrosage implements the Lauren Tan Inverted Trust Pyramid. Every data point is strictly typed, validated through runtime Zod schemas, and verified through automated test suites. We review verification artifacts, not raw code slop."
        },
        # Slide 4: Spacecraft Fire Safety Triad
        {
            "tag": "NASA RESEARCH FOUNDATION",
            "title": "The Spacecraft Fire Safety Triad",
            "subtitle": "Structuring 24 flight and ground investigations into NASA's core safety pillars",
            "cards": [
                ("Pillar 1: Prevention", "Material flammability, Limiting Oxygen Index (LOI), and flame spread under forced airflow. Validated with BASS, BASS-II, Saffire-I/II/III, and CFI-G."),
                ("Pillar 2: Detection", "Microgravity aerosol agglomeration and smoke particle transport. Calibrates optical and ionization sensors using SAME, SAME-R, and DAFT flight data."),
                ("Pillar 3: Suppression", "Extinguishment kinetics, droplet extinction diameters, and gaseous diluent sizing (CO2 and Helium) based on FLEX and FLEX-2 experiments.")
            ],
            "notes": "We structured NASA's entire archive around the agency's Fire Safety Triad: Prevention through flammability limits and material selection, Detection through microgravity smoke particle dynamics, and Suppression through gaseous extinguishment agents like CO2 and Helium."
        },
        # Slide 5: Mission Profiles
        {
            "tag": "OPERATIONAL RISK PROFILES",
            "title": "Simulating Deep Space Environments",
            "subtitle": "Dynamic risk ranking and predictive modeling across 5 exploration atmospheres",
            "cards": [
                ("Lunar Habitat / Rover", "70.3 kPa (10.2 psi), 32% O2, 10 cm/s HVAC flow. High hyperoxic risk where materials self-extinguishing on Earth burn continuously."),
                ("ISS & Orion Transit", "101.3 kPa (14.7 psi), 21% O2, 15 cm/s ventilation. Quiescent smoldering hazards in low-velocity recirculation zones."),
                ("Martian Base & EVA Suits", "Mars habitat at 55.2 kPa with 30% O2; EVA suits at 29.6 kPa with 100% pure oxygen, demanding zero ignition tolerance.")
            ],
            "notes": "Pyrosage allows flight directors and habitat designers to dynamically test their designs against real operational environments. Users can toggle between the Lunar Gateway, pressurized rovers, Martian surface habitats, and pure oxygen EVA suits to evaluate flame spread rates and suppression requirements."
        },
        # Slide 6: Terrestrial Spin-offs
        {
            "tag": "EARTH & SPACE IMPACT",
            "title": "Dual-Use Terrestrial Innovations",
            "subtitle": "How microgravity combustion science protects communities and firefighters on Earth",
            "cards": [
                ("Clean Water-Mist Suppression", "Fine-water-mist suppression systems developed for microgravity eliminate toxic Halon alternatives, providing safe firefighting for data centers and hospitals."),
                ("Sub-Micron Smoke Detection", "Aerosol agglomeration research powers high-sensitivity early warning smoke detectors for industrial cleanrooms, submarines, and mines."),
                ("Next-Gen Firefighter Gear", "Advanced flame-resistant fabrics and lightweight carbon-composite breathing systems originated directly from spacecraft thermal protective research.")
            ],
            "notes": "The benefits of this research extend far beyond orbit. Microgravity combustion discoveries directly improve life on Earth: fine-water-mist extinguishers replace toxic chemical agents, advanced sensors protect industrial facilities, and space-grade materials shield municipal firefighters."
        },
        # Slide 7: Verification & Next Steps
        {
            "tag": "SUMMARY & METRICS",
            "title": "Mission Ready: Verified Intelligence",
            "subtitle": "Empowering humanity's next giant leap with flight-proven fire safety insights",
            "cards": [
                ("100% Verified Artifacts", "All 24 investigations, 2,009 runs, and combustion physics algorithms passed rigorous automated verification with zero regressions."),
                ("Intuitive SI Interface", "Full responsive design with interactive flame simulators, metric comparisons, and data export ready for aerospace research."),
                ("Future Exploration Vision", "Scalable architecture ready to ingest upcoming Artemis, Gateway, and commercial space station flight experiments.")
            ],
            "notes": "In conclusion, Project Pyrosage turns 12 terabytes of complex flight telemetry into clear, verified, and actionable fire safety intelligence. The project is completely built, thoroughly tested, and ready to help safeguard the next generation of space explorers."
        }
    ]

    for index, data in enumerate(slides_data):
        slide = prs.slides.add_slide(blank_layout)
        
        # Set background fill
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = c_bg
        bg_shape.line.fill.background()

        # Add decorative top banner line
        top_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.6), Inches(11.733), Inches(0.04))
        top_line.fill.solid()
        top_line.fill.fore_color.rgb = c_cyan
        top_line.line.fill.background()

        # Tag category
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(10), Inches(0.4))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = data["tag"]
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = c_orange

        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.05), Inches(11.733), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = data["title"]
        p_title.font.size = Pt(28)
        p_title.font.bold = True
        p_title.font.color.rgb = c_white

        # Slide Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.733), Inches(0.5))
        tf_sub = sub_box.text_frame
        tf_sub.word_wrap = True
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = data["subtitle"]
        p_sub.font.size = Pt(15)
        p_sub.font.color.rgb = c_cyan

        # Content rendering
        if "cards" in data:
            cards = data["cards"]
            card_width = Inches(3.68)
            card_height = Inches(4.3)
            gap = Inches(0.35)
            left_start = Inches(0.8)
            top_pos = Inches(2.45)

            for c_idx, (card_title, card_desc) in enumerate(cards):
                card_left = left_start + c_idx * (card_width + gap)
                
                # Card box shape
                card_bg = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, card_left, top_pos, card_width, card_height)
                card_bg.fill.solid()
                card_bg.fill.fore_color.rgb = c_card
                card_bg.line.color.rgb = c_border
                card_bg.line.width = Pt(1.5)

                # Card content text
                card_txt = slide.shapes.add_textbox(card_left + Inches(0.25), top_pos + Inches(0.3), card_width - Inches(0.5), card_height - Inches(0.6))
                tf_c = card_txt.text_frame
                tf_c.word_wrap = True

                p_ct = tf_c.paragraphs[0]
                p_ct.text = card_title
                p_ct.font.size = Pt(18)
                p_ct.font.bold = True
                p_ct.font.color.rgb = c_white
                p_ct.space_after = Pt(14)

                p_cd = tf_c.add_paragraph()
                p_cd.text = card_desc
                p_cd.font.size = Pt(13)
                p_cd.font.color.rgb = c_muted

        elif "bullets" in data:
            # Title slide or bullet slide
            content_left = Inches(0.8)
            content_top = Inches(2.6)
            card_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, content_left, content_top, Inches(11.733), Inches(3.5))
            card_box.fill.solid()
            card_box.fill.fore_color.rgb = c_card
            card_box.line.color.rgb = c_border
            card_box.line.width = Pt(1.5)

            tbox = slide.shapes.add_textbox(content_left + Inches(0.5), content_top + Inches(0.4), Inches(10.733), Inches(2.7))
            tf_b = tbox.text_frame
            tf_b.word_wrap = True

            for b_idx, bullet in enumerate(data["bullets"]):
                p_b = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
                p_b.text = f"[+]  {bullet}"
                p_b.font.size = Pt(17)
                p_b.font.color.rgb = c_white
                p_b.space_after = Pt(16)

            if "footer" in data:
                p_f = tf_b.add_paragraph()
                p_f.text = data["footer"]
                p_f.font.size = Pt(13)
                p_f.font.bold = True
                p_f.font.color.rgb = c_orange

        # Slide number
        num_box = slide.shapes.add_textbox(Inches(11.5), Inches(6.9), Inches(1.2), Inches(0.4))
        tf_num = num_box.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.alignment = PP_ALIGN.RIGHT
        p_num.text = f"{index + 1} / {len(slides_data)}"
        p_num.font.size = Pt(10)
        p_num.font.color.rgb = c_muted

        # Speaker notes
        notes_slide = slide.notes_slide
        tf_notes = notes_slide.notes_text_frame
        tf_notes.text = data["notes"]

    output_path = "Project_Pyrosage_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_deck()
