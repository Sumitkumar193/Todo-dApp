const { parentPort, workerData } = require('worker_threads');
const { pipeline } = require('@huggingface/transformers');

async function sortTodo() {
  try {
    const todos = workerData.todos;
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: `Here is a list of todos:

          [
            ${todos.map((todo) => `"Topic": "${todo.title}", "ID": "${todo.id}"`).join(', \n')}
          ]
          
          Rearrange these todos by priority (high to low). Return the sorted list in JSON format.

          NOTE: 
          1. Do not add any new IDs or items. Only use the ones provided.
          2. Return exactly all 7 todos in descending order.
          3. The output format should be:
          [
            { "Topic": "Topic 1", "ID": "ID 1" },
            { "Topic": "Topic 2", "ID": "ID 2" },
            ...
          ]`,
      },
    ];

    console.log('Generating sorted todos...', messages[1].content);

    const generator = await pipeline(
      'text-generation',
      'onnx-community/Qwen2.5-0.5B-Instruct'
    );

    const output = await generator(messages, { max_new_tokens: 1024, temperature: 0.7 });
    const result = output[0].generated_text.at(-1).content;
    parentPort.postMessage(result);
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
}

sortTodo();