import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Micro Automation Hub",
  description: "Documentation for the Micro Automation Hub platform",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Contributing', link: '/guide/contributing' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Features', link: '/guide/features' },
          { text: 'Architecture', link: '/guide/architecture' },
          { text: 'Contributing', link: '/guide/contributing' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/almostfamousstu/MAH' }
    ],

    search: {
      provider: 'local'
    }
  }
})
