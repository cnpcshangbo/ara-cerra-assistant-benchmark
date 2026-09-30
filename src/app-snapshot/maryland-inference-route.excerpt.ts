    if(filterCommand(question)){
      const refused=(kind:string)=>json({answer:kind==='weather'?'Weather can be queried in the assistant, but it is not a map filter. No filters were changed. Try “How many crashes had rain in 2023?” or choose year, study area, crash selection, GPS cross-check, location estimates or map positions.':kind==='ambiguous'?'Please specify the year, county, crash selection, GPS cross-check, location estimates or map positions to change. For Baltimore, specify Baltimore City or Baltimore County. No filters were changed.':'That request includes conditions the map filters do not support. I can change year, study area, crash selection, GPS cross-check, location estimates and map positions, or reset all filters. No filters were changed.',evidence:null,action:null,model:assistantModelLabel(selectedModel),modelId:selectedModel});
      // Apply a preceding data query only when every constraint exists in the UI.
      if(/^(?:please\s+)?(?:show|display|apply) (?:that|this|these|those|the results|the query) (?:on|to) (?:the |this )?(?:map|filters)[.!?]?$/i.test(question)){
        if(!previousQuery)return refused('ambiguous');
        const action=filterActionFromQuery(previousQuery);if(!action)return refused(previousQuery.weather?'weather':'other');
        return json({answer:filterActionSummary(action),action,evidence:null,model:assistantModelLabel(selectedModel),modelId:selectedModel});
      }
      if(reconcileMarylandPlan({operation:'summary',scope:'filtered'},question).operation==='unsupported')return refused('other');
      let failure='',previousRaw='';
      for(let attempt=0;attempt<2;attempt++){
        const messages=[{role:'system',content:filterActionPrompt},{role:'user',content:JSON.stringify({question,currentFilters:{year:context.year,county:context.county,severity:context.severity,location:context.location??'',estimate:context.estimate??'',placement:context.placement??'estimated'}})}];
        if(failure)messages.push({role:'assistant',content:previousRaw},{role:'user',content:`Validation failed: ${failure} Correct the preceding JSON to operate ONLY the explicitly requested controls. The original question is: ${question}. Return the complete corrected JSON object.`});
        const raw=await modelCall(messages,300,selectedModel,true);previousRaw=raw;
        try{
          const parsed=JSON.parse(raw.replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));
          if(parsed.unsupported)return refused(String(parsed.unsupported));
          const action=validateRequestedFilterAction(parsed,question);
          return json({answer:filterActionSummary(action),action,evidence:null,model:assistantModelLabel(selectedModel),modelId:selectedModel});
        }catch(e){failure=e instanceof Error?e.message:'Invalid JSON';}
      }
      return json({error:'I could not resolve that filter change reliably. Please specify one of the map filters; no filters were changed.'},422);
    }
    let plan:MarylandPlan|undefined;let failure='';
    const safeguard=reconcileMarylandPlan({operation:'summary',scope:'filtered'},question,previousQuery);
    if(safeguard.operation==='unsupported')plan=safeguard;
    for(let attempt=0;!plan&&attempt<2;attempt++){
      const raw=await modelCall([{role:'system',content:plannerPrompt+(failure?'\nPrevious response failed validation: '+failure:'')},{role:'user',content:JSON.stringify({question,history,map:context,previousQuery})}],350,selectedModel,true);
      try{plan=reconcileMarylandPlan(validatePlan(JSON.parse(raw.replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''))),question,previousQuery);break;}catch(e){failure=e instanceof Error?e.message:'Invalid JSON';}
    }
    if(!plan)return json({error:'I could not resolve that query reliably. Try asking for a count, weather coverage, a county/year breakdown, or the selected crash.'},422);
    if(plan.operation==='unsupported')return json({answer:'That question cannot be answered reliably by the available Maryland map queries. I can count crashes, compare years or counties, summarize recorded weather, and explain the selected crash. I cannot infer causes, exposure-adjusted risk, or a HIN, or apply filters that this map does not support.',model:assistantModelLabel(selectedModel),modelId:selectedModel,plan,evidence:null});
    const params=new URLSearchParams({op:'assistant',analysis:plan.operation,scope:plan.scope,group:plan.group??'year',bbox:context.bbox,id:String(context.selectedId??0),year:plan.scope==='all'?'':context.year,county:plan.scope==='all'?'':context.county,severity:plan.scope==='all'?'':context.severity,location:plan.scope==='all'?'':context.location??'',estimate:plan.scope==='all'?'':context.estimate??'',placement:context.placement??'estimated'});
    for(const key of ['year','county','severity','weather','location','estimate','placement'] as const)if(plan[key]!==undefined)params.set(key,plan[key]!);
