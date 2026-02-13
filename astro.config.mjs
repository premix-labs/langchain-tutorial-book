// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [
		starlight({
			disable404Route: true,
			title: 'LangChain คู่มือฉบับสมบูรณ์',
			description: 'เรียนรู้ LangChain ตั้งแต่พื้นฐานจนถึงระดับ Production พร้อมตัวอย่างโค้ดครบถ้วน',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/langchain-ai/langchain' },
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: '🏠 เริ่มต้น',
					items: [
						{ label: 'แนะนำหนังสือ', slug: 'index' },
					],
				},
				{
					label: '📘 ส่วนที่ 1: พื้นฐาน',
					items: [
						{ label: 'บทที่ 1: แนะนำ LangChain และ LLMs', slug: '01-foundations/01-introduction' },
						{ label: 'บทที่ 2: การติดตั้งและตั้งค่า', slug: '01-foundations/02-setup' },
						{ label: 'บทที่ 3: Components หลัก', slug: '01-foundations/03-core-components' },
					],
				},
				{
					label: '📗 ส่วนที่ 2: การใช้งานหลัก',
					items: [
						{ label: 'บทที่ 4: Prompt Templates', slug: '02-core/01-prompts' },
						{ label: 'บทที่ 5: Chains และ LCEL', slug: '02-core/02-chains-lcel' },
						{ label: 'บทที่ 6: Memory', slug: '02-core/03-memory' },
					],
				},
				{
					label: '📕 ส่วนที่ 3: ขั้นสูง',
					items: [
						{ label: 'บทที่ 7: RAG', slug: '03-advanced/01-rag' },
						{ label: 'บทที่ 8: Agents และ Tools', slug: '03-advanced/02-agents-tools' },
						{ label: 'บทที่ 9: LangGraph', slug: '03-advanced/03-langgraph' },
					],
				},
				{
					label: '🚀 ส่วนที่ 4: Production',
					items: [
						{ label: 'บทที่ 10: Deployment', slug: '04-production/01-deployment' },
						{ label: 'บทที่ 11: โปรเจกต์ตัวอย่าง', slug: '04-production/02-projects' },
					],
				},
			],
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: '',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
					},
				},
			],
		}),
		mermaid({
			autoTheme: true,
			mermaidConfig: {
				fontFamily: 'Noto Sans Thai, sans-serif',
			},
		}),
	],
});
