// api/contact/index.js
// Import necessary dependencies if needed

export const post = async ({ request }) => {
	try {
		const formData = await request.formData()

		// Extract form data
		const formDataObject = {}
		for (const [key, value] of formData.entries()) {
			formDataObject[key] = value
		}

		// Log form data for debugging
		console.log('Received form data:', formDataObject)

		// Construct the URL for the Google Form without using encodeURIComponent for the phone number
		const googleFormUrl =
			`https://docs.google.com/forms/d/e/1FAIpQLSexkFxfMgYk6acSiEpGVkCAY_UDShNOvlzqYtftkHUPp93ubQ/formResponse?usp=pp_url&` +
			`entry.234622488=${formDataObject['firstName']}&entry.310606533=${formDataObject['lastName']}&entry.472229466=${formDataObject['email']}` +
			`&entry.1177780878=${formDataObject['title']}&entry.1313009456=${
				formDataObject['company']
			}&entry.836188929=${encodeURIComponent(formDataObject['phoneNumber'])}` +
			`&entry.1253871153=${formDataObject['street']}&entry.1830284187=${formDataObject['city']}&entry.1040059978=${formDataObject['region']}` +
			`&entry.1895320406=${formDataObject['postalCode']}&entry.1430380922=${formDataObject['countryCode']}&entry.1675564272=${formDataObject['currency']}&entry.1276096038=${formDataObject['value']}&entry.703955549=${formDataObject['acxiomID']}&entry.48487709=${formDataObject['moatID']}&entry.93141666=${formDataObject['leadID']}&entry.844537053=${formDataObject['li_fat_id']}&submit=Submit`

		// Log the constructed URL for debugging
		console.log('Constructed URL:', googleFormUrl)

		// Make a request to the Google Form URL
		const response = await fetch(googleFormUrl)

		// Log the Google Form response status
		console.log('Google Form response status:', response.status)

		// Return appropriate response based on the Google Form submission status
		return {
			status: response.status,
			body: {
				message: response.status === 200 ? 'success' : 'failed'
			}
		}
	} catch (error) {
		console.error('Error processing form submission:', error)

		// Return an error response
		return {
			status: 500,
			body: {
				message: 'error'
			}
		}
	}
}
