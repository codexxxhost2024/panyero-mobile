// This script would be used by developers to update all HTML files to include the theme CSS
// In a real implementation, you would run this on your development environment

const fs = require("fs")
const path = require("path")

// List of all HTML files that need updating
const filesToUpdate = [
  "mobile_topup.html",
  "myapp.html",
  "scientist.html",
  "seafarer.html",
  "shops.html",
  "stopwatch.html",
  "success.html",
  "teacher.html",
  "tip_calculator.html",
  "todo.html",
  "tongits.html",
  "transfer-balance.html",
  "translator.html",
  "unit_converter.html",
  "upload-id.html",
  "user-details.html",
  "userlist.html",
  "utility_electricity.html",
  "utility_gas.html",
  "utility_internet.html",
  "utility_water.html",
  "walletmain.html",
  "weather_app.html",
  "word_counter.html",
  "sample-new-page.html",
  "onboarding.html",
  "index.html",
  "signup3.html",
  "signup2.html",
  "budget_planner.html",
  "bmi_calculator.html",
  "bill_payments.html",
  "3d_generator.html",
  "cashin.html",
  "cards.html",
]

// Function to update a file
function updateFile(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, "utf8")

    // Check if the theme CSS is already included
    if (content.includes("panyero-theme.css")) {
      console.log(`${filePath} already has theme CSS`)
      return
    }

    // Add viewport meta tag if needed
    if (!content.includes("user-scalable=no")) {
      content = content.replace(
        /<meta name="viewport"[^>]*>/,
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">',
      )
    }

    // Add theme CSS link
    content = content.replace("</head>", '  <link rel="stylesheet" href="css/panyero-theme.css">\n</head>')

    // Update header if it uses bg-green-600
    content = content.replace(/class="bg-green-600/g, 'class="bg-primary')

    // Write the updated content back to the file
    fs.writeFileSync(filePath, content)
    console.log(`Updated ${filePath}`)
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error)
  }
}

// Process all files
filesToUpdate.forEach((file) => {
  updateFile(file)
})

console.log("Theme update complete!")

