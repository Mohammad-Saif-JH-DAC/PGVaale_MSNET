using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace PGVaaleDotNetBackend.Services
{
    public class PdfGeneratorService
    {
        private readonly ILogger<PdfGeneratorService> _logger;

        public PdfGeneratorService(ILogger<PdfGeneratorService> logger)
        {
            _logger = logger;
        }

        public byte[] GenerateContractPdf(string userName, string userId, string roomNo, string price)
        {
            try
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    Document document = new Document(PageSize.A4, 50, 50, 50, 50); // margins
                    PdfWriter writer = PdfWriter.GetInstance(document, ms);

                    document.Open();

                    // Fonts
                    Font titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18);
                    Font subTitleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14);
                    Font sectionTitleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLUE);
                    Font regularFont = FontFactory.GetFont(FontFactory.HELVETICA, 12);
                    Font italicFont = FontFactory.GetFont(FontFactory.HELVETICA_OBLIQUE, 11);

                    // Title
                    Paragraph title = new Paragraph("ROOM BOOKING CONFIRMATION CONTRACT", titleFont);
                    title.Alignment = Element.ALIGN_CENTER;
                    title.SpacingAfter = 20f;
                    document.Add(title);

                    // Intro
                    Paragraph intro = new Paragraph("This legal agreement certifies that the following individual has successfully booked a room at PGVaale Rentals under the stated terms and conditions.", regularFont);
                    intro.Alignment = Element.ALIGN_JUSTIFIED;
                    intro.SpacingAfter = 15f;
                    document.Add(intro);

                    // Divider
                    Paragraph divider = new Paragraph("_________________________________________", regularFont);
                    divider.Alignment = Element.ALIGN_CENTER;
                    divider.SpacingBefore = 10f;
                    divider.SpacingAfter = 10f;
                    document.Add(divider);

                    // User Details Section
                    Paragraph detailsTitle = new Paragraph("User & Booking Details", sectionTitleFont);
                    detailsTitle.SpacingBefore = 10f;
                    detailsTitle.SpacingAfter = 8f;
                    document.Add(detailsTitle);

                    document.Add(new Paragraph("Name: " + userName, regularFont));
                    document.Add(new Paragraph("User ID: " + userId, regularFont));
                    document.Add(new Paragraph("Room Number: " + roomNo, regularFont));
                    document.Add(new Paragraph("Booking Price: " + price, regularFont));

                    document.Add(Chunk.NEWLINE);

                    // Do's and Don'ts Section
                    Paragraph rulesTitle = new Paragraph("DO's and DON'Ts", sectionTitleFont);
                    rulesTitle.SpacingBefore = 10f;
                    rulesTitle.SpacingAfter = 8f;
                    document.Add(rulesTitle);

                    Paragraph dos = new Paragraph("✔ DO's:", subTitleFont);
                    document.Add(dos);
                    List doList = new List(List.UNORDERED);
                    doList.Add(new ListItem("Carry valid government-issued photo ID during check-in.", regularFont));
                    doList.Add(new ListItem("Comply with all PG rules and curfews.", regularFont));
                    doList.Add(new ListItem("Maintain cleanliness in personal and shared spaces.", regularFont));
                    doList.Add(new ListItem("Report any maintenance issues to management promptly.", regularFont));
                    doList.Add(new ListItem("Respect other tenants' privacy and space.", regularFont));
                    document.Add(doList);

                    document.Add(Chunk.NEWLINE);

                    Paragraph donts = new Paragraph("✘ DON'Ts:", subTitleFont);
                    document.Add(donts);
                    List dontList = new List(List.UNORDERED);
                    dontList.Add(new ListItem("Do not engage in illegal or disruptive activities within the premises.", regularFont));
                    dontList.Add(new ListItem("Avoid tampering with electrical, fire, or safety systems.", regularFont));
                    dontList.Add(new ListItem("Sub-letting the room is strictly prohibited.", regularFont));
                    dontList.Add(new ListItem("Loud music or parties are not allowed without prior permission.", regularFont));
                    document.Add(dontList);

                    document.Add(Chunk.NEWLINE);

                    // Policies & Legal
                    Paragraph policyTitle = new Paragraph("Policies & Legal Guidelines", sectionTitleFont);
                    policyTitle.SpacingBefore = 10f;
                    policyTitle.SpacingAfter = 8f;
                    document.Add(policyTitle);

                    List policies = new List(List.UNORDERED);
                    policies.Add(new ListItem("Advance rent payment is non-refundable in case of early termination.", regularFont));
                    policies.Add(new ListItem("Any damage to property will be charged to the tenant.", regularFont));
                    policies.Add(new ListItem("Tenant must provide biometric verification at the time of check-in.", regularFont));
                    policies.Add(new ListItem("This contract is governed by the rental regulations applicable in the local jurisdiction.", regularFont));
                    document.Add(policies);

                    document.Add(Chunk.NEWLINE);

                    // Final Note
                    Paragraph finalNote = new Paragraph("Please keep a printed copy of this contract. Verification of identity and document submission will be done at the time of possession.", italicFont);
                    finalNote.SpacingBefore = 10f;
                    finalNote.SpacingAfter = 20f;
                    document.Add(finalNote);

                    // Signature fields
                    Paragraph signatureLine = new Paragraph("Tenant Signature: ___________________________", regularFont);
                    signatureLine.SpacingBefore = 30f;
                    document.Add(signatureLine);

                    Paragraph dateLine = new Paragraph("Date: _______________", regularFont);
                    dateLine.SpacingBefore = 10f;
                    document.Add(dateLine);

                    Paragraph authoritySign = new Paragraph("Authorized Signature (PGVaale): ___________________________", regularFont);
                    authoritySign.SpacingBefore = 20f;
                    document.Add(authoritySign);

                    document.Close();
                    writer.Close();

                    _logger.LogInformation("PDF contract generated successfully for user: {UserName}", userName);
                    return ms.ToArray();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate PDF contract for user: {UserName}", userName);
                throw;
            }
        }
    }
}
