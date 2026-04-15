package com.hypeculture.util;

import com.google.gson.*;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Gson-based JSON serialization helper.
 *
 * Provides a shared Gson instance with LocalDateTime support,
 * plus convenience methods for writing JSON API responses with
 * the standard envelope: {success, data, error}.
 */
public class JsonUtil {

    private static final DateTimeFormatter DT_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    private static final Gson GSON = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer())
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeDeserializer())
            .serializeNulls()
            .create();

    private JsonUtil() {}

    /** Serialize any object to a JSON string. */
    public static String toJson(Object obj) {
        return GSON.toJson(obj);
    }

    /** Deserialize a JSON string to the given class. */
    public static <T> T fromJson(String json, Class<T> clazz) {
        return GSON.fromJson(json, clazz);
    }

    /** Deserialize using a Type for generic types (e.g. TypeToken). */
    public static <T> T fromJson(java.io.Reader reader, Class<T> clazz) {
        return GSON.fromJson(reader, clazz);
    }

    /**
     * Write a JSON response with the given HTTP status code.
     * Sets Content-Type to application/json and writes the body.
     */
    public static void sendJson(HttpServletResponse resp, int status, Object body)
            throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(GSON.toJson(body));
    }

    /** Build a success envelope: {success: true, data: <data>} */
    public static Map<String, Object> ok(Object data) {
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("success", true);
        envelope.put("data", data);
        return envelope;
    }

    /** Build a success envelope with no data payload. */
    public static Map<String, Object> ok() {
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("success", true);
        return envelope;
    }

    /** Build an error envelope: {success: false, error: <message>} */
    public static Map<String, Object> error(String message) {
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("success", false);
        envelope.put("error", message);
        return envelope;
    }

    // ------------------------------------------------------------------
    // LocalDateTime adapters
    // ------------------------------------------------------------------

    private static class LocalDateTimeSerializer
            implements JsonSerializer<LocalDateTime> {
        @Override
        public JsonElement serialize(LocalDateTime src, Type type,
                                     JsonSerializationContext ctx) {
            return src == null ? JsonNull.INSTANCE
                               : new JsonPrimitive(src.format(DT_FMT));
        }
    }

    private static class LocalDateTimeDeserializer
            implements JsonDeserializer<LocalDateTime> {
        @Override
        public LocalDateTime deserialize(JsonElement json, Type type,
                                          JsonDeserializationContext ctx)
                throws JsonParseException {
            return LocalDateTime.parse(json.getAsString(), DT_FMT);
        }
    }
}
