import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Export Assessment to PDF
export const exportAssessmentToPDF = (assessment, responses) => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Blue
  doc.text('9Lenses Assessment Report', 20, yPosition);
  yPosition += 15;

  // Assessment Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Title: ${assessment.title}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Created: ${new Date(assessment.createdAt).toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Status: ${assessment.status}`, 20, yPosition);
  yPosition += 15;

  // Description
  if (assessment.description) {
    doc.setFontSize(10);
    const splitDescription = doc.splitTextToSize(assessment.description, 170);
    doc.text(splitDescription, 20, yPosition);
    yPosition += (splitDescription.length * 7) + 10;
  }

  // Participants Section
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Participants', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  responses.forEach((response, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(`${index + 1}. ${response.participant.firstName} ${response.participant.lastName} (${response.participant.email})`, 25, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Responses Summary
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('Response Summary', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  responses.forEach((response, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.text(`Participant ${index + 1}: ${response.participant.firstName} ${response.participant.lastName}`, 25, yPosition);
    yPosition += 7;
    doc.text(`Completed: ${response.completedAt ? new Date(response.completedAt).toLocaleDateString() : 'In Progress'}`, 30, yPosition);
    yPosition += 10;
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`9Lenses Report - Page ${i} of ${pageCount}`, 20, 285);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 285);
  }

  // Save the PDF
  doc.save(`9Lenses_Assessment_${assessment.id}.pdf`);
};

// Export Assessment to Excel
export const exportAssessmentToExcel = (assessment, responses) => {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Assessment Overview Sheet
  const overviewData = [
    ['9Lenses Assessment Report'],
    [''],
    ['Assessment Title', assessment.title],
    ['Description', assessment.description || 'N/A'],
    ['Status', assessment.status],
    ['Created', new Date(assessment.createdAt).toLocaleDateString()],
    ['Start Date', assessment.startDate ? new Date(assessment.startDate).toLocaleDateString() : 'N/A'],
    ['End Date', assessment.endDate ? new Date(assessment.endDate).toLocaleDateString() : 'N/A'],
    ['Total Participants', responses.length],
    ['Completed Responses', responses.filter(r => r.completedAt).length]
  ];

  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, wsOverview, 'Overview');

  // Participants Sheet
  const participantsData = [
    ['#', 'First Name', 'Last Name', 'Email', 'Completed', 'Completion Date']
  ];

  responses.forEach((response, index) => {
    participantsData.push([
      index + 1,
      response.participant.firstName,
      response.participant.lastName,
      response.participant.email,
      response.completedAt ? 'Yes' : 'No',
      response.completedAt ? new Date(response.completedAt).toLocaleDateString() : 'N/A'
    ]);
  });

  const wsParticipants = XLSX.utils.aoa_to_sheet(participantsData);
  XLSX.utils.book_append_sheet(wb, wsParticipants, 'Participants');

  // Responses Detail Sheet (if available)
  if (responses.length > 0 && responses[0].answers) {
    const responsesData = [['Participant', 'Question', 'Answer']];

    responses.forEach((response) => {
      const participantName = `${response.participant.firstName} ${response.participant.lastName}`;
      const answers = typeof response.answers === 'string' ? JSON.parse(response.answers) : response.answers;

      Object.entries(answers).forEach(([question, answer]) => {
        responsesData.push([participantName, question, answer]);
      });
    });

    const wsResponses = XLSX.utils.aoa_to_sheet(responsesData);
    XLSX.utils.book_append_sheet(wb, wsResponses, 'Responses');
  }

  // Save the file
  XLSX.writeFile(wb, `9Lenses_Assessment_${assessment.id}.xlsx`);
};

// Export Dashboard Data to Excel
export const exportDashboardToExcel = (dashboardData) => {
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ['9Lenses Dashboard Export'],
    ['Generated', new Date().toLocaleDateString()],
    [''],
    ['Metric', 'Value']
  ];

  Object.entries(dashboardData.summary || {}).forEach(([key, value]) => {
    summaryData.push([key, value]);
  });

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // Assessments Sheet
  if (dashboardData.assessments && dashboardData.assessments.length > 0) {
    const assessmentsData = [
      ['Title', 'Status', 'Created', 'Participants', 'Completion Rate']
    ];

    dashboardData.assessments.forEach((assessment) => {
      assessmentsData.push([
        assessment.title,
        assessment.status,
        new Date(assessment.createdAt).toLocaleDateString(),
        assessment.participantEmails.length,
        assessment.completionRate || 'N/A'
      ]);
    });

    const wsAssessments = XLSX.utils.aoa_to_sheet(assessmentsData);
    XLSX.utils.book_append_sheet(wb, wsAssessments, 'Assessments');
  }

  XLSX.writeFile(wb, `9Lenses_Dashboard_${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Export Document Analysis to PDF
export const exportDocumentAnalysisToPDF = (document, analysis) => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('9Lenses Document Analysis', 20, yPosition);
  yPosition += 15;

  // Document Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Document: ${document.title}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Uploaded: ${new Date(document.createdAt).toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Size: ${(document.fileSize / 1024).toFixed(2)} KB`, 20, yPosition);
  yPosition += 15;

  // Analysis Content
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text('AI Analysis Results', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  if (analysis) {
    const splitAnalysis = doc.splitTextToSize(analysis, 170);
    splitAnalysis.forEach((line) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`9Lenses Document Analysis - Page ${i} of ${pageCount}`, 20, 285);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 285);
  }

  doc.save(`9Lenses_Document_Analysis_${document.id}.pdf`);
};

// Generic data export to CSV
export const exportToCSV = (data, filename) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${filename}.csv`, { bookType: 'csv' });
};
