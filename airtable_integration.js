// Import the Airtable package
const Airtable = require('airtable');

// Configure the API key
Airtable.configure({
  apiKey: 'patvY5l70StRwBslK.98b7fb0f97d23296a704f368b8f87881c701f1073b23030ab4f6a7aa9518e0a2'
});

// Create an instance of Airtable and specify your base ID
const base = new Airtable({ apiKey: 'patvY5l70StRwBslK.98b7fb0f97d23296a704f368b8f87881c701f1073b23030ab4f6a7aa9518e0a2' }).base('d70mG6oTNe34JN');

// Wrap the code in a try-catch block
try {
  // Perform an example operation (retrieving records from a table)
  base('MOTORQ DATABASE').select({
    maxRecords: 10,
    view: 'Grid view'
  }).firstPage((err, records) => {
    if (err) {
      console.error('Error retrieving records:', err);
      return;
    }
    console.log(records);
  });
} catch (error) {
  console.error('An error occurred:', error);
}
