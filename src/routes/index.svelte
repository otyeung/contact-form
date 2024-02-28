<script>
	import { onMount } from 'svelte'

	let submitStatus

	// Begin SHA-256 hashing function
	const hashData = async (value) => {
		const encoder = new TextEncoder()
		const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(value))
		const hashArray = Array.from(new Uint8Array(buffer))
		return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
	}
	// End SHA-256 hashing function

	// Begin Cookie routine
	// getcookie function
	function getCookie(name) {
		if (typeof document !== 'undefined') {
			let matches = document.cookie.match(
				new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
			)
			return matches ? decodeURIComponent(matches[1]) : undefined
		}
		return undefined
	}
	// End Cookie routine

	const submitForm = async (event) => {
		submitStatus = 'submitting'
		const formData = new FormData(event.currentTarget)

		// Dynamically get the li_fat_id value from the browser
		const li_fat_id =
			(typeof window !== 'undefined' &&
				new URLSearchParams(window.location.search).get('li_fat_id')) ||
			(typeof document !== 'undefined' && getCookie('li_fat_id')) ||
			''

		// Add the dynamically obtained li_fat_id to the form data
		formData.append('li_fat_id', li_fat_id)

		const hashedEmail = await hashData(formData.get('email'))
		const hashedPhoneNumber = await hashData(formData.get('phoneNumber'))
		const hashedFirstName = await hashData(formData.get('firstName'))
		const hashedLastName = await hashData(formData.get('lastName'))

		// Method 1 : pass parameters via user_data, note that you must pass all hashed values including li_fat_id captured from browser
		gtag('set', 'user_data', {
			// Standard fields
			email: formData.get('email'),
			sha256_email_address: hashedEmail,
			phone: formData.get('phoneNumber'),
			sha256_phone_number: hashedPhoneNumber,
			address: {
				first_name: formData.get('firstName'),
				sha256_first_name: hashedFirstName,
				last_name: formData.get('lastName'),
				sha256_last_name: hashedLastName,
				street: formData.get('street'),
				city: formData.get('city'),
				region: formData.get('region'),
				postal_code: formData.get('postalCode'),
				country: formData.get('countryCode')
			},
			// Non-standard fields
			jobTitle: formData.get('title'),
			companyName: formData.get('company'),
			linkedinFirstPartyId: li_fat_id,
			//			currency: formData.get('currency'),
			//			value: formData.get('value'),
			acxiomID: formData.get('acxiomID'),
			moatID: formData.get('moatID')
		})
		window.dataLayer = window.dataLayer || []
		dataLayer.push({
			event: 'capi_form_submit',
			currency: formData.get('currency'),
			value: formData.get('value')
		})

		// Method 2 :
		// 1. pass all parameters via data layer
		// 2. you can pass li_fat_id from browser here or you can execute code at GTM web container to capture li_fat_id
		// window.dataLayer = window.dataLayer || []
		// dataLayer.push({
		// 	event: 'LinkedIn CAPI',
		// 	email: formData.get('email'),
		// 	sha256_email_address: hashedEmail,
		// 	linkedinFirstPartyId: li_fat_id,
		// 	firstName: formData.get('firstName'),
		// 	lastName: formData.get('lastName'),
		// 	title: formData.get('title'),
		// 	companyName: formData.get('company'),
		// 	countryCode: formData.get('countryCode'),
		// 	currency: formData.get('currency'),
		// 	value: formData.get('value'),
		// 	acxiomID: formData.get('acxiomID'),
		// 	moatID: formData.get('moatID')
		// })

		// Post the form data to Google Sheet via Google Form API
		const res = await fetch('/api/contact', {
			method: 'POST',
			body: formData
		})

		const { message } = await res.json()
		submitStatus = message

		// firing event pixel to LinkedIn
		window.lintrk('track', { conversion_id: 15708492 })
	}

	const resetForm = () => {
		const form = document.getElementById('contactForm')
		if (form) {
			form.reset()
		}
		submitStatus = undefined
	}

	// Helper function to go back to main page to accept a new response
	const goToMainPage = () => {
		resetForm()
		window.location.href = '/' // Replace '/' with the actual path to your main page
	}

	// Begin Cookie banner
	let showCookieBanner = false

	const checkTrackingCookie = () => {
		// Check if cookie 'trackingAccepted' exists, if it already exists, remove the modal
		if (typeof getCookie('trackingAccepted') !== 'undefined') {
			const trackingConsentElement = document.querySelector('.tracking-consent')
			if (trackingConsentElement) {
				trackingConsentElement.remove()
			}
		} else {
			// Set a 2-second delay before displaying the cookie banner
			setTimeout(() => {
				showCookieBanner = true
			}, 100)
		}
	}

	const declineTracking = () => {
		// Remove the cookie 'trackingAccepted'
		document.cookie = 'trackingAccepted=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

		// Hide the cookie banner
		showCookieBanner = false
		// Add logic for declining tracking (if needed)
	}

	const acceptTracking = () => {
		showCookieBanner = false
		// set cookie 'trackingAccepted' to "ok" with expiry of 180 days
		const d = new Date()
		d.setTime(d.getTime() + 180 * 24 * 60 * 60 * 1000)
		const expires = 'expires=' + d.toUTCString()
		document.cookie = 'trackingAccepted=ok;' + expires + ';path=/'
	}
	// End Cookie banner

	onMount(() => {
		// Check for tracking cookie on page load
		checkTrackingCookie()
		// Additional initialization logic if needed
	})
</script>

<div class="container">
	<h1>Contact Form App</h1>
	<p>LinkedIn CAPI + GTM Online Conversion Demo</p>

	{#if submitStatus === 'submitting'}
		<p>Submitting...</p>
	{:else if submitStatus === 'failed'}
		<p>Form submission failed</p>
	{:else if submitStatus === 'success'}
		<p>Form submission successful</p>
		<button type="button" on:click="{goToMainPage}" class="big-submit-button"
			>Submit Another Response</button
		>
	{:else if submitStatus === undefined}
		<form id="contactForm" on:submit|preventDefault="{submitForm}">
			<input type="hidden" id="li_fat_id" name="li_fat_id" value="" />
			<div class="input-container" id="firstNameContainer">
				<label for="first name">First Name</label>
				<input type="text" name="firstName" id="firstName" value="John" />
			</div>
			<div class="input-container" id="lastNameContainer">
				<label for="last name">Last Name</label>
				<input type="text" name="lastName" id="lastName" value="Doe" />
			</div>
			<div class="input-container" id="emailContainer">
				<label for="email"> Email</label>
				<input type="text" name="email" id="email" value="john.doe@example.com" />
			</div>
			<div class="input-container" id="titleContainer">
				<label for="title"> Title</label>
				<input type="text" name="title" id="title" value="Engineer" />
			</div>

			<div class="input-container" id="companyContainer">
				<label for="company"> Company</label>
				<input type="text" name="company" id="company" value="Acme Inc" />
			</div>

			<div class="input-container" id="phoneNumberContainer">
				<label for="phoneNumber"> Phone Number </label>
				<input type="text" name="phoneNumber" id="phone_number" value="+12672493672" />
			</div>

			<div class="input-container" id="streetContainer">
				<label for="street"> Street </label>
				<input type="text" name="street" id="street" value="2243 Saint Francis Way" />
			</div>

			<div class="input-container" id="cityContainer">
				<label for="city"> City </label>
				<input type="text" name="city" id="city" value="Livonia" />
			</div>

			<div class="input-container" id="regionContainer">
				<label for="region"> Region </label>
				<input type="text" name="region" id="region" value="Pennsylvania" />
			</div>

			<div class="input-container" id="postalCodeContainer">
				<label for="postalCode"> Postal Code </label>
				<input type="text" name="postalCode" id="postalCode" value="19103" />
			</div>

			<div class="input-container" id="countryCodeContainer">
				<label for="countryCode"> Country Code </label>
				<input type="text" name="countryCode" id="countryCode" value="US" />
			</div>

			<div class="input-container" id="currencyContainer">
				<label for="currency"> Currency </label>
				<input type="text" name="currency" id="currency" value="USD" />
			</div>

			<div class="input-container" id="valueContainer">
				<label for="value"> Value </label>
				<input type="text" name="value" id="value" value="50.0" />
			</div>

			<div class="input-container" id="acxiomIDContainer">
				<label for="acxiomID"> Acxiom ID </label>
				<input type="text" name="acxiomID" id="acxiomID" value="12345678" />
			</div>

			<div class="input-container" id="moatIDContainer">
				<label for="moatID"> Oracle Moat ID </label>
				<input type="text" name="moatID" id="moatID" value="12345678" />
			</div>

			<div class="submit-container">
				<input type="submit" class="small-submit-button" />
			</div>
		</form>
	{/if}
	<p>
		By clicking Submit, this app will add the lead into <a
			href="https://docs.google.com/spreadsheets/d/1vQ8aYWgK8YeUQP6mR1GJXRGaF5sA9tK1iq2HP_dFaoU/edit?usp=sharing"
			target="_blank">Google Sheet</a
		> and fire an event to GTM web container.
	</p>

	{#if showCookieBanner}
		<div class="modal-overlay">
			<div class="modal tracking-consent">
				<div>
					<p class="paragraph-2">
						We're using tracking to measure how you use this site.
						<a href="/privacy-policy" class="link-5">Learn more</a>.
						<a href="/privacy-policy"></a><br />
					</p>
				</div>
				<div class="section-3">
					<a href="#" on:click|preventDefault="{declineTracking}" class="decline-tracking"
						>Decline</a
					>
					<a href="#" on:click|preventDefault="{acceptTracking}" class="accept-tracking w-button"
						>Accept</a
					>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		border: 1px solid black;
		width: 600px;
		margin: 0 auto;
		text-align: center;
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h1 {
		font-size: 24px;
		margin-bottom: 20px;
	}

	form {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.input-container {
		width: 48%;
		margin-bottom: 20px;
	}

	label {
		margin-bottom: 5px;
		font-weight: bold;
		white-space: nowrap;
	}

	input {
		padding: 8px;
		width: 100%;
		box-sizing: border-box;
	}

	.small-submit-button {
		width: 10%; /* Set the desired width */
		background-color: #4caf50;
		color: white;
		cursor: pointer;
	}

	.small-submit-button:hover {
		background-color: #45a049;
	}

	.submit-container {
		margin-top: 20px;
		width: 100%;
		text-align: center;
	}

	.big-submit-button {
		width: 220px; /* Set the desired width */
		height: 40px; /* Set the desired height */
		font-size: 16px; /* Set the desired font size */
		background-color: #4caf50; /* Set your preferred background color */
		color: white; /* Set your preferred text color */
		cursor: pointer;
		border: none;
		border-radius: 5px; /* Set the desired border radius */
	}

	.big-submit-button:hover {
		background-color: #45a049; /* Set your preferred hover background color */
	}
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal {
		background: #fff;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
		max-width: 400px;
		width: 100%;
		text-align: center;
	}

	.modal p {
		margin-bottom: 15px;
	}

	.link-5 {
		color: #3498db;
		text-decoration: none;
		font-weight: bold;
	}

	.link-5:hover {
		text-decoration: underline;
	}

	.section-3 {
		margin-top: 20px;
	}

	.decline-tracking,
	.accept-tracking {
		display: inline-block;
		padding: 10px 20px;
		margin-right: 10px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		text-decoration: none;
		color: #fff;
		font-weight: bold;
	}

	.decline-tracking {
		background: #e74c3c;
	}

	.accept-tracking {
		background: #2ecc71;
	}
</style>
