interface DeleteConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({ isVisible, onConfirm, onCancel }: DeleteConfirmationModalProps) {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white p-6 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this todo? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

