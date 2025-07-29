
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
  const fileExt = file.name.split(".").pop();
  const filePath = `${userEmail}/${type}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("user_docs")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  return data.path;
};

