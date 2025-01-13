import { supabase } from "@/lib/supabase/supabase";

async function uploadImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('taskdocs')
      .upload(fileName, file);
  
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  
    console.log('Uploaded image:', data);
    return data;
  }