package com.hypeculture.servlet;

import com.hypeculture.util.JsonUtil;
import com.hypeculture.util.SessionManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@MultipartConfig(
    maxFileSize = 10 * 1024 * 1024,
    maxRequestSize = 20 * 1024 * 1024
)
public class ImageServlet extends HttpServlet {

    private static final String UPLOAD_DIR = "images/products/";

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        if (!SessionManager.isSeller(req) && !SessionManager.isAdmin(req)) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_FORBIDDEN,
                    JsonUtil.error("Seller or admin account required"));
            return;
        }

        Part filePart = req.getPart("image");
        if (filePart == null) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("No image file provided"));
            return;
        }

        String contentType = filePart.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            JsonUtil.sendJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    JsonUtil.error("File must be an image"));
            return;
        }

        String originalFilename = getSubmittedFileName(filePart);
        String extension = getFileExtension(originalFilename);
        if (extension.isEmpty()) {
            extension = ".jpg";
        }

        String savedName = UUID.randomUUID() + extension;

        Path uploadDir = Path.of(getServletContext().getRealPath("/") + UPLOAD_DIR);
        Files.createDirectories(uploadDir);

        Path targetPath = uploadDir.resolve(savedName);

        try (InputStream input = filePart.getInputStream()) {
            Files.copy(input, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        String imageUrl = "/" + UPLOAD_DIR + savedName;

        Map<String, String> result = new HashMap<>();
        result.put("imageUrl", imageUrl);
        result.put("filename", savedName);

        JsonUtil.sendJson(resp, HttpServletResponse.SC_CREATED, JsonUtil.ok(result));
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        JsonUtil.sendJson(resp, HttpServletResponse.SC_METHOD_NOT_ALLOWED,
                JsonUtil.error("GET not supported"));
    }

    private String getSubmittedFileName(Part part) {
        String contentDisposition = part.getHeader("content-disposition");
        if (contentDisposition == null) return "";
        for (String token : contentDisposition.split(";")) {
            token = token.trim();
            if (token.startsWith("filename=")) {
                String filename = token.substring(9);
                if (filename.startsWith("\"") && filename.endsWith("\"")) {
                    filename = filename.substring(1, filename.length() - 1);
                }
                int lastSep = Math.max(filename.lastIndexOf('/'), filename.lastIndexOf('\\'));
                if (lastSep >= 0) filename = filename.substring(lastSep + 1);
                return filename;
            }
        }
        return "";
    }

    private String getFileExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot > 0 ? filename.substring(dot) : "";
    }
}