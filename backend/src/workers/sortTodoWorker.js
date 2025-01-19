const { parentPort, workerData } = require('worker_threads');
const { pipeline } = require('@huggingface/transformers');

async function sortTodo() {
  try {
    const todos = workerData.todos;
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: `I need help with my todo list. I have ${todos.length} todos.
          Here are the todos with their topics and ids:
          [
            ${todos.map((todo) => `"Topic": "${todo.title}", "ID": "${todo.id}"`).join(', \n')}
          ]
          Can you help me rearrange the arrays according to the priorities of the todos titles?

          NOTE: ONLY RETURN JSON WITH REARRANGED OBJECTS IN DESCENDING ORDER (High to Low). 
                DO NOT ADD ANY ADDITIONAL INFORMATION OR COMMENTS AND ONLY RETURN THE GIVEN TOPICS.
          Example: [{ "Topic": "Todo 1", "ID": "1" }, { "Topic": "Todo 2", "ID": "2" }]`,
      },
    ];

    const generator = await pipeline(
      'text-generation',
      'onnx-community/Llama-3.2-1B-Instruct',
    );

    const output = await generator(messages, { max_new_tokens: 512 });
    const result = output[0].generated_text.at(-1).content;
    parentPort.postMessage(result);
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
}

sortTodo();