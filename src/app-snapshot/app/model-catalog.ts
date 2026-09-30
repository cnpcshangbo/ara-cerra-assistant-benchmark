export const assistantModels=[
  {id:'openai-gpt-6.1-sol',label:'GPT-6.1 Sol'},
  {id:'qwen3-8b',label:'Qwen3 8B'},
  {id:'qwen3-14b',label:'Qwen3 14B'},
  {id:'qwen3.8-27b',label:'Qwen3.8 27B'},
  {id:'llama3.1-8b',label:'Llama 3.1 8B'},
  {id:'gemma3-4b',label:'Gemma 3 4B'},
  {id:'gemma4-12b',label:'Gemma 4 12B'},
  {id:'openai-gpt-4.1-mini',label:'GPT-4.1 mini'},
  {id:'openai-gpt-5.4-mini',label:'GPT-5.4 mini'},
  {id:'openai-gpt-5.4',label:'GPT-5.4'},
] as const;
export type AssistantModelId=typeof assistantModels[number]['id'];
export const openAIModelIds=['openai-gpt-6.1-sol','openai-gpt-4.1-mini','openai-gpt-5.4-mini','openai-gpt-5.4'] as const;
export type OpenAIModelId=typeof openAIModelIds[number];
export function isOpenAIModel(id:AssistantModelId):id is OpenAIModelId{return openAIModelIds.some(value=>value===id);}
export const defaultAssistantModel:AssistantModelId='qwen3-8b';
export type ModelAvailability={id:AssistantModelId;ready:boolean};
export function resolveAssistantModel(value:unknown):AssistantModelId {
  if(value===undefined)return defaultAssistantModel;
  if(typeof value!=='string'||!assistantModels.some(m=>m.id===value))throw new Error('Invalid model selection');
  return value as AssistantModelId;
}
export function assistantModelLabel(id:AssistantModelId):string {return assistantModels.find(m=>m.id===id)!.label;}
