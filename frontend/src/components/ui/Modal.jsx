import { MdClose } from 'react-icons/md';

/**
 * Reusable modal overlay used by panels that need create/edit dialogs.
 * Provides: backdrop blur, centered card, header with title + close button.
 */
export default function Modal({ title, titleIcon, onClose, children, maxWidth = 'max-w-md' }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl w-full ${maxWidth} border border-gray-200 shadow-2xl overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            {titleIcon}
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <MdClose size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
