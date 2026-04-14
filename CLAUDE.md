## Rules
1. **MUST**: Any type of workarounds are not allowed. Everything needs to be implemented properly without any monkey patches. Need to research properly
2. **MUST**: If any workarounds are seen then suggest to remove them
3. **MUST**: DO NOT make any file monolithic instead make small modular files which are easy to maintain
4. **MUST**: In the frontend only one component per file is allowed. So create seprate files for each component
6. **MUST**: When removing some component file always first clean up its keys from i18n translation files
7. **MUST**: When adding a new component or updating one, always first add the translations for it for all languages in the i18n translation files
8. **MUST**: Always follow this data flow repos -> service -> router. router can never call repos directly and service can never use db directly. stick to onion architecture strictly.
9. **MUST**: Before adding anything in Frontend or backend we have to ensure that we keep everything platform agnostic and dont use the platform clients like meta client directly. we have to go through the platform client
10. **MUST**: Never leave in dead and unused code. Always clean up the code and remove files
11. **MUST**: Always run build and lint anf type check after update and make sure it passess without workarounds. like avoid ignoring with eslint or using any type.
12. **MUST**: If the errors are older then your update then try to resolve them still or ask me what to do
13. **MUST**: Never create duplicate code, always see if that code is already available or not
14. **MUST**: Make sure we dont introduce n+1 queries that can upset the performance. 
15. **MUST**: If some query needs index and we can add that index without overloading db we should add that index for faster processing
16. **MUST**: Make sure to make the UI responsive for both mobile and desktop
17. **MUST**: When working on the UI we have to make sure that UI doesnt look generic. Besides UI we have to strongly focus on making the UX as easy as possible for a layman like dropshippers to understand. We have to provide the tooltip guides everywhere needed.
18. **MUST**: we have to be platform agnostic, never hardcode anything that can make our platform otherwise
19. **MUST**: Always use phosphor icons not the lucid ones