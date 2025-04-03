<script lang="ts">
  import { onMount, tick } from "svelte";
  import MarkdownIt from "markdown-it";

  let message = "";
  let messages: { role: string; content: string }[] = [];
  const md = MarkdownIt();

  onMount(async () => {
    const request = await fetch("http://localhost:5173/api2/generate")
    const apiResponse = await request.json();
    response = apiResponse?.message?.content || ""
  });
</script>

<div class="p-4">
  <div class="rounded p-4 bg-blue-200 shadow">
    {@html md.render(response)}
  </div>
</div>
  