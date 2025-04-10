<script lang="ts">
  import { onMount, tick } from "svelte";
  import MarkdownIt from "markdown-it";

  let message = "";
  let messages: { role: string; content: string }[] = [];
  const md = MarkdownIt();
  const API_URL = "/api2/generate";

  const sendMessage = async () => {
    if (!message.trim()) return;

    messages = [...messages, { role: "user", content: message }];
    message = "";
    await tick();
    scrollToBottom();

    messages = [...messages, { role: "assistant", content: "Thinking..." }];

    try {
      const res = await fetch(API_URL, { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      messages[messages.length - 1].content = data.message?.content || "No response received.";
    } catch (error) {
      messages[messages.length - 1].content = "Oops! An error occurred. Please try again.";
    }

    await tick();
    scrollToBottom();
  };

  const scrollToBottom = () => {
    const chatBox = document.querySelector("#chatBox");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  };
</script>

<!-- Chat UI -->
<div class="w-full h-screen flex flex-col bg-gray-900 text-white">
  <div id="chatBox" class="flex-1 overflow-y-auto p-4 space-y-4">
    {#each messages as msg}
      <div class={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
        <div class="flex items-center space-x-3">
          {#if msg.role !== "user"}
            <img src="/logo.png" class="w-8 h-8 rounded-full" alt="ai"/>
          {/if}
          <div class={`p-3 rounded-lg max-w-xs break-words whitespace-pre-wrap ${msg.role === "user" ? "bg-blue-600" : "bg-gray-700"}`}>
            {@html md.render(msg.content)}
          </div>
          {#if msg.role === "user"}
            <img src="/user.jpg" class="w-8 h-8 rounded-full" alt="user" />
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <!-- Input Box -->
  <div class="w-full p-4 bg-gray-800 border-t border-gray-700 flex items-center">
    <input
      type="text"
      bind:value={message}
      placeholder="Enter your message..."
      class="flex-1 bg-gray-700 text-white p-3 rounded-lg outline-none"
      on:keydown={(e) => e.key === "Enter" && sendMessage()}
    />
    <button on:click={sendMessage} class="ml-3 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg">
      Send
    </button>
  </div>
</div>
