<script>
	import { onMount } from 'svelte';

	let users = [];
	/**
	 * @type {any[]}
	 */
	let entries = [];
	/**
	 * @type {any[]}
	 */
	let tables = [];
	/**
	 * @type {any}
	 */
	let selectedTable = null;

	onMount(async () => {
		const response = await fetch('http://localhost:3000/user');
		const tablesResponse = await fetch('http://localhost:3000/telemetry');
		users = await response.json();
		tables = await tablesResponse.json();
	});

	/**
	 *
	 * @param tableName
	 */
	const fetchEntries = async (/** @type {any} */ tableName) => {
		if (tableName) {
			const entriesData = await fetch(`http://localhost:3000/telemetry/entries?table=${tableName}`);
			entries = await entriesData.json();
		}
	};

	$: if (selectedTable) {
		fetchEntries(selectedTable);
	}
</script>

<div class="flex min-h-screen bg-gray-100">
	<!-- Sidebar -->
	<aside class="w-64 bg-white shadow-md" style="min-width: 220px;">
		<div class="p-4">
			<h2 class="text-xl font-bold">Tables</h2>
			<ul class="mt-4 space-y-2 cursor-pointer">
				{#each tables as table}
					<li>
						<button
							class="p-2 w-full bg-gray-200 rounded-md cursor-pointer"
							on:click={() => (selectedTable = table)}
							type="button"
						>
							{table}
						</button>
					</li>
				{/each}
			</ul>
		</div>
		<hr />
		<div class="p-4">
			<button type="button" class="p-2 bg-gray-200 rounded-md cursor-pointer w-full"
				>+ New View</button
			>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 p-8" style="overflow-x: scroll;">
		<h2 class="text-2xl font-bold mb-4">Users Table</h2>
		<table class="w-full bg-white shadow-md rounded-md">
			<thead>
				<tr class="bg-gray-200">
					{#if entries.length > 0}
						{#each Object.keys(entries[0]) as header}
							<th class="p-2 text-left">{header}</th>
						{/each}
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each entries as entry}
					<tr>
						{#each Object.values(entry) as value}
							<td class="p-2 border-t">{value}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</main>
</div>
