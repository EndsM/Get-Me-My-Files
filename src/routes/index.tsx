import { component$ } from "@builder.io/qwik";
import { Form, routeAction$, type DocumentHead } from "@builder.io/qwik-city";
import path from "path";
import fs from "node:fs/promises";

export const useUploadFile = routeAction$(async (_data, ev) => {
  const formData = await ev.parseBody();
  if (!formData || typeof formData !== "object" || !("file" in formData)) {
    return { success: false, message: "No file uploaded" };
  }

  const file = formData.file as File;

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Invalid file" };
  }

  const uploadDir = path.join(process.cwd(), "uploads");

  try {
    await fs.mkdir(uploadDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(uploadDir, file.name);

    await fs.writeFile(filePath, buffer);

    return {
      success: true,
      message: `Saved to local: ${file.name} (File Size: ${(file.size / 1024 / 1024).toFixed(2)} MB)`,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Server error writing file" };
  }
});

export default component$(() => {
  const uploadAction = useUploadFile();

  return (
    <>
      <h1>Hi 👋</h1>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </div>
      <Form action={uploadAction} enctype="multipart/form-data">
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="file"
            name="file"
            required
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={uploadAction.isRunning}
          style={{
            padding: "10px 20px",
            backgroundColor: "#66ccff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            opacity: uploadAction.isRunning ? 0.7 : 1,
          }}
        >
          {uploadAction.isRunning ? "Uploading..." : "Send File"}
        </button>
      </Form>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
