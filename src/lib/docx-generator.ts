
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType, Table, TableCell, TableRow, WidthType, VerticalAlign, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import type { Volunteer } from '@/types/volunteer';

// Helper function to fetch image as buffer
async function fetchImage(url: string): Promise<Buffer> {
    // This is a proxy to avoid CORS issues in development/client-side fetching.
    // In a real production app, you might have a dedicated API route for this.
    const response = await fetch(`https://images.weserv.nl/?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

const createStyledParagraph = (text: string, options: { bold?: boolean; size?: number; color?: string } = {}) => {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                bold: options.bold ?? false,
                size: (options.size ?? 11) * 2, // docx size is in half-points
                font: "Calibri",
                color: options.color,
            }),
        ],
        spacing: { after: 100 },
    });
};

const createLabelAndValue = (label: string, value?: string) => {
    return new Paragraph({
        children: [
            new TextRun({ text: `${label} : `, bold: true, font: "Calibri", size: 22 }),
            new TextRun({ text: value || 'N/A', font: "Calibri", size: 22 }),
        ],
        spacing: { after: 120 },
    });
};

export const generateDocx = async (volunteer: Volunteer) => {
    try {
        let photoBuffer: Buffer | undefined;
        if (volunteer.photo) {
            try {
                photoBuffer = await fetchImage(volunteer.photo);
            } catch (e) {
                console.error("Could not fetch profile photo, skipping.", e);
            }
        }
        
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1440, // 1 inch
                            right: 1440,
                            bottom: 1440,
                            left: 1440,
                        },
                    },
                },
                children: [
                    // --- HEADER ---
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({ children: [new TextRun({ text: "CROIX-ROUGE GABONAISE", bold: true })], alignment: AlignmentType.CENTER }),
                                            new Paragraph({ children: [new TextRun({ text: "COMITE DU 6ème ARRONDISSEMENT", bold: true })], alignment: AlignmentType.CENTER }),
                                        ],
                                        verticalAlign: VerticalAlign.CENTER,
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "", spacing: { after: 200 } }),
                    
                    new Paragraph({
                        children: [new TextRun({ text: "FICHE D'ADHESION VOLONTAIRE", bold: true, underline: {} })],
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),
                    
                    // --- IDENTIFICATION SECTION ---
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        columnWidths: [7500, 2100],
                        rows: [
                             new TableRow({
                                children: [
                                    // Personal Info Cell
                                    new TableCell({
                                        children: [
                                            createLabelAndValue("Matricule", volunteer.matricule),
                                            createLabelAndValue("Nom(s)", volunteer.lastName),
                                            createLabelAndValue("Prénom(s)", volunteer.firstName),
                                            createLabelAndValue("Né(e) le", volunteer.birthDate ? new Date(volunteer.birthDate).toLocaleDateString('fr-FR') : 'N/A'),
                                            createLabelAndValue("À", volunteer.birthPlace),
                                            createLabelAndValue("N° CNI", volunteer.idCardNumber),
                                        ],
                                        verticalAlign: VerticalAlign.TOP,
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                    }),
                                    // Photo Cell
                                    new TableCell({
                                        children: [
                                            photoBuffer
                                                ? new Paragraph({
                                                      children: [new ImageRun({ data: photoBuffer, transformation: { width: 100, height: 120 } })],
                                                      alignment: AlignmentType.CENTER,
                                                  })
                                                : new Paragraph({ text: "[PHOTO]", alignment: AlignmentType.CENTER }),
                                        ],
                                        verticalAlign: VerticalAlign.TOP,
                                        borders: { 
                                            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" }, 
                                            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" }, 
                                            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" }, 
                                            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" } 
                                        },
                                    }),
                                ],
                            }),
                        ]
                    }),

                    new Paragraph({ text: "", spacing: { after: 200 } }),
                    createStyledParagraph("INFORMATIONS COMPLEMENTAIRES", { bold: true }),
                    createLabelAndValue("Situation de famille", volunteer.maritalStatus),
                    createLabelAndValue("Téléphone", volunteer.phone),
                    createLabelAndValue("E-mail", volunteer.email),
                    createLabelAndValue("Adresse", volunteer.address),
                    createLabelAndValue("Niveau d'études", volunteer.educationLevel),
                    createLabelAndValue("Profession", volunteer.profession),
                    
                    new Paragraph({ text: "", spacing: { after: 200 } }),
                    createStyledParagraph("ENGAGEMENT", { bold: true }),
                    createLabelAndValue("Cellule d'affectation souhaitée", volunteer.assignedCell),
                    createLabelAndValue("Domaines d'intérêt", volunteer.causes?.join(', ')),
                    createLabelAndValue("Disponibilités", volunteer.availability?.join(', ')),

                    new Paragraph({ text: "", spacing: { after: 400 } }),

                    new Paragraph({
                        children: [new TextRun({ text: "Fait à Libreville, le " + new Date().toLocaleDateString('fr-FR'), size: 22 })],
                        alignment: AlignmentType.RIGHT,
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Signature du volontaire", size: 22, bold: true })],
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 800 },
                    }),
                ],
            }],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `Fiche_adhesion_${volunteer.lastName}_${volunteer.firstName}.docx`);
        });

    } catch (error) {
        console.error("Error generating DOCX:", error);
    }
};
