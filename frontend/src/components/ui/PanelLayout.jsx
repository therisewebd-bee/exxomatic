/**
 * Reusable panel layout wrapper used by all side-panel views.
 * Provides consistent page structure: full-height scrollable container,
 * centered content area, and a header row with icon + title + action button.
 */
export default function PanelLayout({ icon, title, action, maxWidth = '5xl', children }) {
  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50 h-screen">
      <div className={`max-w-${maxWidth} mx-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {icon}
            {title}
          </h2>
          {action}
        </div>

        {children}
      </div>
    </div>
  );
}
