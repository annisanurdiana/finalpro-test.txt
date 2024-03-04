import { useState } from "react";

function PostContentEditor({ initialContent, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialContent);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(editedContent); // Simpan editedContent ke database atau API Anda

    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={10} // Sesuaikan dengan jumlah baris yang sesuai
            cols={50} // Sesuaikan dengan jumlah kolom yang sesuai
          />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div>
          <div dangerouslySetInnerHTML={{ __html: editedContent }} />
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default PostContentEditor;
