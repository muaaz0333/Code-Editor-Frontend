<template>
  <div class="min-h-screen bg-white">
    <div class="flex items-center">
      <div class="flex items-center w-[70%] p-3">
        <div class="grow"><label class="block text-xl font-semibold text-gray-700">Interview AI Code Editor</label></div>
      
        <select v-model="language" class="w-[200px] p-1 me-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <button @click="executeCode()" class=" px-3 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">
          Execute
        </button>
      </div>
      <label class="block text-lg font-semibold text-gray-700 ms-4">Output:</label>
    </div>
    

    

    <div class="flex">
      <!-- Code Input Section -->
      <div class="w-[70%] bg-white px-3">
        
        
        <!-- <textarea
            v-model="code"
            class="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your code here..."
        ></textarea> -->
        <div class="editor-container h-[90vh]" ref="editorContainer" id="monaco-editor"></div>
      </div>

      <!-- Output Section -->
      <div class="w-[30%] bg-white px-6">
        <div class="h-[90vh] p-4 bg-gray-50 border border-gray-300 rounded-md overflow-y-auto">
          <pre v-if="output">{{ output }}</pre>
          <p v-else class="text-gray-500">No output yet. Run your code to see the results.</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import HttpService from '../services/http.service';
import { onBeforeMount, onMounted, onBeforeUnmount, ref, watch } from "vue";
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"

const httpService = new HttpService();

const editorContainer = ref(null);
let editorInstance: any = null;

const output = ref('');
const language = ref<string>('javascript');
const code = ref('');

onBeforeMount(() => {
  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === "json") {
        return new jsonWorker()
      }
      if (label === "css" || label === "scss" || label === "less") {
        return new cssWorker()
      }
      if (label === "html" || label === "handlebars" || label === "razor") {
        return new htmlWorker()
      }
      if (label === "typescript" || label === "javascript") {
        return new tsWorker()
      }
      return new editorWorker()
    }
  }
});

onMounted(() => {
  const el = document.getElementById('monaco-editor');
  if( el ){
    editorInstance = monaco.editor.create(el, {
      value: '',
      language: language.value,
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 15,
      lineNumbers: "on",
      roundedSelection: false,
      wordWrap: "wordWrapColumn",
      wordWrapColumn: 100,
      wrappingIndent: "indent", // "same", "indent" or "none"
      // showToolbar: 'always' //  "always" | "never" | "onHover"
      // mode: "prefix" | "subword" | "subwordSmart"
    });
  }else{
    window.alert('Error occured while initializing editor');
  }
});

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.dispose();
  }
});

watch( language, (newVal, oldVal) => {
  if (editorInstance) {
    monaco.editor.setModelLanguage(editorInstance.getModel(), newVal);
  }
})

const executeCode = async () => {
  try {
    output.value = '';
    httpService.post(
      '/code-execution',
      JSON.stringify({
        code: editorInstance.getValue(),
        language: language.value,
      }),
      ( err: any, res: any) => {
        if( err ){
          output.value = err;
        }else{
          output.value = res;
        }
      }
    );
  } catch (error) {
    console.error('Error executing code:', error);
    output.value = 'Error executing code';
  }
}
</script>




<style scoped>
#monaco-editor {
  width: 100%;
}
</style>
