'use client'

import { useState } from 'react'

interface CodeTab {
  label: string
  code: string
}

export default function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="flex border-b border-gray-700 bg-gray-800 rounded-t-lg">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              active === i
                ? 'text-green-400 border-b-2 border-green-400 bg-gray-900'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-b-lg font-mono text-sm overflow-x-auto">
        <code>{tabs[active].code}</code>
      </pre>
    </div>
  )
}
