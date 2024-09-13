<script>
  let email = '';
  let password = '';

  function handleSubmit() {
    // Handle login logic here
    alert(`Email: ${email}, Password: ${password}`);
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
    <h2 class="text-2xl font-bold text-center">Login</h2>
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" bind:value={email} required class="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200" />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" id="password" bind:value={password} required class="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200" />
      </div>
      <button type="submit" class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200">Login</button>
    </form>
  </div>
</div>
