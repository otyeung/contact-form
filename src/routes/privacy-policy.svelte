<!-- privacy-policy.svelte -->
<script>
	import { onMount } from 'svelte'

	onMount(() => {
		// Additional initialization logic if needed
	})
</script>

<div class="privacy-policy-container">
	<h1>Privacy Policy</h1>
	<p>
		Welcome to our Privacy Policy page. This page is meant to inform you about our policies
		regarding the collection, use, and disclosure of personal data when you use our service.
	</p>
	<!-- Add your privacy policy content here -->

	<p>
		If you have any questions or concerns about our Privacy Policy, please contact us at
		<a href="mailto:privacy@example.com">privacy@example.com</a>.
	</p>
</div>

<style>
	.privacy-policy-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}

	h1 {
		font-size: 28px;
		margin-bottom: 20px;
	}

	p {
		font-size: 16px;
		line-height: 1.6;
		margin-bottom: 15px;
	}

	a {
		color: #3498db;
		text-decoration: none;
		font-weight: bold;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
