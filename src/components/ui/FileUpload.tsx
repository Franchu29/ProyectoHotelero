export default function FileUpload() {
  return (
    <div className="space-y-2">
      <p className="text-xs tracking-wide text-gray-500 uppercase">
        Documentation & Media
      </p>

      <div className="border border-dashed border-[#E7E4DD] rounded-2xl p-10 text-center">
        <p className="text-sm text-gray-500">
          Drag & drop files to upload
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Limit 50MB per file. PDF, JPEG, PNG, DOCX
        </p>
      </div>
    </div>
  );
}