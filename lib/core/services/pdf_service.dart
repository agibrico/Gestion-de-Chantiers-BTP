import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:intl/intl.dart';

class PdfService {
  static const PdfColor primaryColor = PdfColor.fromInt(0xFFEA580C); // Orange Securite
  static const PdfColor secondaryColor = PdfColor.fromInt(0xFF0F172A); // Acier BTP

  Future<Uint8List> generateSiteDiaryReport({
    required String projectName,
    required DateTime date,
    required String weather,
    required String activities,
    required int workers,
    required String author,
    String? incidents,
  }) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (context) => [
          _buildHeader(projectName, 'RAPPORT JOURNALIER DE CHANTIER'),
          pw.SizedBox(height: 24),
          _buildInfoSection(date, weather, workers, author),
          pw.SizedBox(height: 24),
          _buildContentSection('ACTIVITÉS ET TRAVAUX RÉALISÉS', activities),
          if (incidents != null && incidents.isNotEmpty) ...[
            pw.SizedBox(height: 16),
            _buildContentSection('INCIDENTS ET ALÉAS', incidents, isWarning: true),
          ],
          pw.Spacer(),
          _buildFooter(),
        ],
      ),
    );

    return pdf.save();
  }

  pw.Widget _buildHeader(String projectName, String reportTitle) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Row(
          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
          children: [
            pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Text('AGB CHANTIER', 
                  style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold, color: secondaryColor)),
                pw.Text('CIRCUIT TECHNOLOGIQUE', 
                  style: const pw.TextStyle(fontSize: 8, letterSpacing: 2, color: PdfColors.grey)),
              ],
            ),
            pw.Container(
              padding: const pw.EdgeInsets.all(8),
              decoration: pw.BoxDecoration(color: primaryColor, borderRadius: pw.BorderRadius.circular(4)),
              child: pw.Text('PROJET : $projectName', 
                style: pw.TextStyle(color: PdfColors.white, fontSize: 10, fontWeight: pw.FontWeight.bold)),
            ),
          ],
        ),
        pw.SizedBox(height: 20),
        pw.Divider(color: primaryColor, thickness: 2),
        pw.SizedBox(height: 10),
        pw.Center(
          child: pw.Text(reportTitle, 
            style: pw.TextStyle(fontSize: 16, fontWeight: pw.FontWeight.bold, color: secondaryColor)),
        ),
      ],
    );
  }

  pw.Widget _buildInfoSection(DateTime date, String weather, int workers, String author) {
    final dateFormat = DateFormat('EEEE dd MMMM yyyy', 'fr_FR');
    
    return pw.Container(
      padding: const pw.EdgeInsets.all(12),
      decoration: pw.BoxDecoration(
        border: pw.Border.all(color: PdfColors.grey300),
        borderRadius: pw.BorderRadius.circular(8),
      ),
      child: pw.Column(
        children: [
          _buildInfoRow('DATE DU RAPPORT', dateFormat.format(date).toUpperCase()),
          pw.Divider(color: PdfColors.grey100),
          _buildInfoRow('CONDITIONS MÉTÉO', weather.toUpperCase()),
          pw.Divider(color: PdfColors.grey100),
          _buildInfoRow('EFFECTIF TOTAL', '$workers OUVRIERS'),
          pw.Divider(color: PdfColors.grey100),
          _buildInfoRow('RÉDIGÉ PAR', author.toUpperCase()),
        ],
      ),
    );
  }

  pw.Widget _buildInfoRow(String label, String value) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 4),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Text(label, style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey600)),
          pw.Text(value, style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold)),
        ],
      ),
    );
  }

  pw.Widget _buildContentSection(String title, String content, {bool isWarning = false}) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Container(
          padding: const pw.EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: pw.BoxDecoration(
            color: isWarning ? PdfColors.red : secondaryColor,
            borderRadius: const pw.BorderRadius.only(topLeft: pw.Radius.circular(4), topRight: pw.Radius.circular(4)),
          ),
          child: pw.Text(title, style: pw.TextStyle(color: PdfColors.white, fontSize: 10, fontWeight: pw.FontWeight.bold)),
        ),
        pw.Container(
          width: double.infinity,
          padding: const pw.EdgeInsets.all(12),
          decoration: pw.BoxDecoration(
            border: pw.Border.all(color: isWarning ? PdfColors.red200 : PdfColors.grey300),
            color: isWarning ? PdfColor.fromInt(0xFFFEF2F2) : PdfColors.white,
            borderRadius: const pw.BorderRadius.only(
              bottomLeft: pw.Radius.circular(8),
              bottomRight: pw.Radius.circular(8),
              topRight: pw.Radius.circular(8),
            ),
          ),
          child: pw.Text(content, style: const pw.TextStyle(fontSize: 11, lineSpacing: 1.5)),
        ),
      ],
    );
  }

  pw.Widget _buildFooter() {
    return pw.Column(
      children: [
        pw.Divider(color: PdfColors.grey300),
        pw.SizedBox(height: 8),
        pw.Row(
          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
          children: [
            pw.Text('Généré via AGB CHANTIER Mobile App', 
              style: const pw.TextStyle(fontSize: 7, color: PdfColors.grey500)),
            pw.Text('© 2026 AGB CIRCUIT TECHNOLOGIQUE', 
              style: const pw.TextStyle(fontSize: 7, color: PdfColors.grey500)),
          ],
        ),
      ],
    );
  }
}
