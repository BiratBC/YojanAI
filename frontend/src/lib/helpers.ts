
import supabase from "@/lib/supabaseClient";
export const createGoogleCalendarEvent = async () => {
    const accessToken = localStorage.getItem("google_access_token"); // Or from wherever you store it
    if (!accessToken) {
      console.error("No access token found!");
      return;
    }

    const event = {
      summary: "AI Generated: Focus Session",
      description: "90-minute deep work session created by YojanAI",
      start: {
        dateTime: "2025-06-07T09:00:00+05:45", // Nepal Time example
        timeZone: "Asia/Kathmandu",
      },
      end: {
        dateTime: "2025-06-07T10:30:00+05:45",
        timeZone: "Asia/Kathmandu",
      },
    };

    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Event created:", result);
        alert("✅ Event added to Google Calendar!");
      } else {
        console.error("Failed to create event:", result);
        alert("❌ Failed to create event.");
      }
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

export const uploadFileToStorage = async (
  file: File,
  type: "classRoutine" | "subjectList",
  userEmail: string
) => {
  try {
    // Get file extension, default to 'bin' if none found
    const fileExt = file.name.split(".").pop() || 'bin';
    
    // Sanitize email for use in file path (replace @ and . with _)
    const sanitizedEmail = userEmail.replace(/[@.]/g, '_');
    
    // Create unique file path
    const filePath = `${sanitizedEmail}/${type}.${fileExt}`;
    
    console.log(`Attempting to upload ${type} to path: ${filePath}`);
    
    const { data, error } = await supabase.storage
      .from("userdocs")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error(`Upload error for ${type}:`, error);
      throw new Error(`Failed to upload ${type}: ${error.message}`);
    }

    console.log(`Successfully uploaded ${type}:`, data.path);
    return data.path;
    
  } catch (error) {
    console.error(`Exception during ${type} upload:`, error);
    return null;
  }
};

export const getSignedFileUrl = async (filePath : any) => {
  const { data, error } = await supabase.storage
    .from("userdocs")
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) {
    console.error("Error creating signed URL:", error);
    return null;
  }

  return data.signedUrl;
};