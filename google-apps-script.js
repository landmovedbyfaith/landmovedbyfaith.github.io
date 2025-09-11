// Google Apps Script Code
// This code should be pasted into Google Apps Script (script.google.com)
// It will handle form submissions and save them to Google Sheets

function doPost(e) {
  try {
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (or create/specify one)
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your actual spreadsheet ID
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // If this is the first row, add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Message']);
    }
    
    // Add the form data to the sheet
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.message || ''
    ]);
    
    // Optional: Send email notification (uncomment if needed)
    /*
    MailApp.sendEmail({
      to: 'your-email@example.com',
      subject: 'New Contact Form Submission - Land Moved By Faith',
      body: `
        New contact form submission:
        
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone}
        Message: ${data.message}
        
        Submitted at: ${data.timestamp}
      `
    });
    */
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (optional - for testing)
  return ContentService
    .createTextOutput(JSON.stringify({ message: 'Contact form endpoint is working' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify the script works
function testFunction() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    message: 'This is a test message',
    timestamp: new Date().toLocaleString()
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log(result.getContent());
}
