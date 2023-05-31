"use strict";var A=Object.create;var M=Object.defineProperty;var E=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var $=Object.getPrototypeOf,N=Object.prototype.hasOwnProperty;var b=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var B=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of T(t))!N.call(e,r)&&r!==n&&M(e,r,{get:()=>t[r],enumerable:!(o=E(t,r))||o.enumerable});return e};var d=(e,t,n)=>(n=e!=null?A($(e)):{},B(t||!e||!e.__esModule?M(n,"default",{value:e,enumerable:!0}):n,e));var C=b((V,G)=>{G.exports={name:"dotenv",version:"16.0.3",description:"Loads environment variables from .env file",main:"lib/main.js",types:"lib/main.d.ts",exports:{".":{require:"./lib/main.js",types:"./lib/main.d.ts",default:"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},scripts:{"dts-check":"tsc --project tests/types/tsconfig.json",lint:"standard","lint-readme":"standard-markdown",pretest:"npm run lint && npm run dts-check",test:"tap tests/*.js --100 -Rspec",prerelease:"npm test",release:"standard-version"},repository:{type:"git",url:"git://github.com/motdotla/dotenv.git"},keywords:["dotenv","env",".env","environment","variables","config","settings"],readmeFilename:"README.md",license:"BSD-2-Clause",devDependencies:{"@types/node":"^17.0.9",decache:"^4.6.1",dtslint:"^3.7.0",sinon:"^12.0.1",standard:"^16.0.4","standard-markdown":"^7.1.0","standard-version":"^9.3.2",tap:"^15.1.6",tar:"^6.1.11",typescript:"^4.5.4"},engines:{node:">=12"}}});var g=b((X,p)=>{var H=require("fs"),I=require("path"),J=require("os"),U=C(),K=U.version,L=/(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;function F(e){let t={},n=e.toString();n=n.replace(/\r\n?/mg,`
`);let o;for(;(o=L.exec(n))!=null;){let r=o[1],s=o[2]||"";s=s.trim();let a=s[0];s=s.replace(/^(['"`])([\s\S]*)\1$/mg,"$2"),a==='"'&&(s=s.replace(/\\n/g,`
`),s=s.replace(/\\r/g,"\r")),t[r]=s}return t}function m(e){console.log(`[dotenv@${K}][DEBUG] ${e}`)}function Y(e){return e[0]==="~"?I.join(J.homedir(),e.slice(1)):e}function W(e){let t=I.resolve(process.cwd(),".env"),n="utf8",o=!!(e&&e.debug),r=!!(e&&e.override);e&&(e.path!=null&&(t=Y(e.path)),e.encoding!=null&&(n=e.encoding));try{let s=l.parse(H.readFileSync(t,{encoding:n}));return Object.keys(s).forEach(function(a){Object.prototype.hasOwnProperty.call(process.env,a)?(r===!0&&(process.env[a]=s[a]),o&&m(r===!0?`"${a}" is already defined in \`process.env\` and WAS overwritten`:`"${a}" is already defined in \`process.env\` and was NOT overwritten`)):process.env[a]=s[a]}),{parsed:s}}catch(s){return o&&m(`Failed to load ${t} ${s.message}`),{error:s}}}var l={config:W,parse:F};p.exports.config=l.config;p.exports.parse=l.parse;p.exports=l});var i=require("discord.js");var j=d(g());j.default.config();var{DISCORD_TOKEN:O,DISCORD_CLIENT_ID:R,OPENAI_API_KEY:x}=process.env;if(!O||!R||!x)throw new Error("Missing environment variables");var _={DISCORD_TOKEN:O,DISCORD_CLIENT_ID:R,OPENAI_API_KEY:x};function u(e,t={}){return{messages:e?[...e]:[{role:"system",content:"You are an AI assistant that helps people find information."},{role:"user",content:"marco!"}],model:"gpt-4",max_tokens:1800,temperature:.7,frequency_penalty:.1,presence_penalty:.3,top_p:.95,stop:null,...t}}var P=d(g());P.config();function f(e){return{hostname:"api.openai.com",path:"/v1/chat/completions",method:"POST",headers:{"Content-Type":"application/json","Content-Length":e.length,authorization:`Bearer ${process.env.OPENAI_API_KEY}`}}}var q=d(require("https"));async function h(e,t){return new Promise((n,o)=>{let r=q.request(e,s=>{let a="";s.on("data",c=>{a+=c}),s.on("end",()=>{n(a)})});r.on("error",s=>{console.error(s),o(s)}),r.write(t),r.end()})}async function v(e){let t=JSON.stringify(u(e)),n=f(t),o=await h(n,t);return JSON.parse(o).choices[0].message.content}function Q(e,t){let n=[],o=0;for(;o<e.length;){let r=o+t;for(;e[r]&&e[r]!==" "&&e[r]!==`
`&&r>o;)r--;r===o&&(r=o+t);let s=e.slice(o,r);n.push(s),o=r+1}return n}async function w(e,t){let n=Q(t,1900);for(let o=0;o<n.length;o++)await e.send(`'''${n[o]}`)}var D=e=>async t=>{if(t.content&&t.content.startsWith("!")){await t.react("\u23F3");try{if(t.channelId){let n=e.channels.cache.get(t.channelId);if(n&&!n.isThread()){let o=await n.messages.fetch(n.lastMessageId),s=await(await n.threads.create({name:t.content.slice(0,20),autoArchiveDuration:60,startMessage:o})).fetch(),a=await v([{role:"user",content:t.content.slice(1)}]);await w(s,a),t.reactions.removeAll();return}if(n&&n.isThread()){let r=(await n.messages.fetch({limit:20,cache:!0})).map(({author:{username:c},content:y})=>({role:c==="lmm-gpt"?"assistant":"user",content:c==="lmm-gpt"?y.replace("\u2019","'"):y.slice(1).replace("\u2019","'")})).reverse(),s=await n.fetchStarterMessage();r[0]={role:"user",content:s.content.slice(1)};let a=await v(r);await w(n,a),t.reactions.removeAll();return}}}catch(n){t.reactions.removeAll(),t.react("\u{1F6A7}"),console.error("Bot message thrown an error",n);return}}};var S=async(e,t)=>{if(e.partial)try{await e.fetch()}catch(n){console.error("Something went wrong when fetching the message:",n);return}e._emoji.name.includes("\u{1F5D1}")&&e.message.delete()};var k=()=>{let e=new i.Client({intents:[i.GatewayIntentBits.Guilds,i.GatewayIntentBits.GuildMessages,i.GatewayIntentBits.GuildMessageReactions,i.GatewayIntentBits.MessageContent],partials:[i.Partials.Message,i.Partials.Channel,i.Partials.Reaction]});return e.once("ready",async()=>{console.log("Discord bot is ready! \u{1F916}")}),e.on("guildCreate",async t=>{}),e.on(i.Events.MessageCreate,D(e)),e.on(i.Events.MessageCreate,t=>{}),e.on(i.Events.MessageReactionAdd,S),e.login(_.DISCORD_TOKEN),e};k();
