package com.animalxgym.manager.application;

import com.animalxgym.manager.domain.GymMember;
import com.animalxgym.manager.domain.GymMemberRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.util.Iterator;

@Service
public class ExcelUploadService {
    private final GymMemberRepository repository;

    public ExcelUploadService(GymMemberRepository repository) {
        this.repository = repository;
    }

    public String processExcel(MultipartFile file) {
        int guardados = 0;
        int actualizados = 0;
        int errores = 0;
        StringBuilder erroresMsg = new StringBuilder();
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();
            if (rowIterator.hasNext()) rowIterator.next(); // Saltar cabecera
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                try {
                    GymMember member = new GymMember();
                    member.setId(toLong(row.getCell(0)));
                    member.setNombre(getStr(row.getCell(1)));
                    member.setCorreo(getStr(row.getCell(2)));
                    member.setTelefono(getPhoneStr(row.getCell(3)));
                    member.setGenero(getStr(row.getCell(4)));
                    member.setEdad(toInt(row.getCell(5)));
                    member.setFechaNacimiento(formatFechaNacimiento(row.getCell(6)));
                    member.setDni(toLong(row.getCell(7)));
                    member.setEstadoCuota(getStr(row.getCell(8)));
                    member.setDiaPagarCuota(formatDiaPagarCuota(row.getCell(9)));
                    member.setTipoPago(getStr(row.getCell(10)));
                    member.setCuota(getStr(row.getCell(11)));
GymMember existente = repository.findById(member.getId());
if (existente != null) {
    // Copiamos todos los campos del Excel sobre el objeto existente para actualizar
    existente.setNombre(member.getNombre());
    existente.setCorreo(member.getCorreo());
    existente.setTelefono(member.getTelefono());
    existente.setGenero(member.getGenero());
    existente.setEdad(member.getEdad());
    existente.setFechaNacimiento(member.getFechaNacimiento());
    existente.setDni(member.getDni());
    existente.setEstadoCuota(member.getEstadoCuota());
    existente.setDiaPagarCuota(member.getDiaPagarCuota());
    existente.setTipoPago(member.getTipoPago());
    existente.setCuota(member.getCuota());
    member = existente;
    actualizados++;
} else {
    guardados++;
}
repository.saveOrUpdate(member);
                } catch (Exception e) {
                    errores++;
                    erroresMsg.append("Fila ").append(row.getRowNum() + 1).append(": ").append(e.getMessage()).append("\n");
                }
            }
        } catch (Exception e) {
            return "Error procesando el archivo: " + e.getMessage();
        }
        return "Creados: " + guardados + ", Actualizados: " + actualizados + ", Errores: " + errores + (errores > 0 ? "\n" + erroresMsg : "");
    }
    private String getStr(Cell cell) { return cell == null ? null : cell.toString(); }
    // Extrae campo teléfono como string o nulo
    private String getPhoneStr(Cell cell) {
        if (cell == null) return null;
        try {
            if(cell.getCellType() == CellType.NUMERIC) {
                long val = (long)cell.getNumericCellValue();
                return String.valueOf(val);
            }
            String str = cell.toString().trim();
            if(str.equals("") || str.equalsIgnoreCase("null")) return null;
            return str;
        } catch(Exception e) {
            return null;
        }
    }
    private Integer toInt(Cell cell) { if (cell == null) return null; try { return (int) cell.getNumericCellValue(); } catch (Exception e) { return Integer.valueOf(cell.toString().replace(".0", "")); } }
    private Long toLong(Cell cell) { if (cell == null) return null; try { return (long) cell.getNumericCellValue(); } catch (Exception e) { return Long.valueOf(cell.toString().replace(".0", "")); } }

    private String formatDiaPagarCuota(Cell cell) {
        if (cell == null || cell.toString().trim().isEmpty()) return null;
        String valor = cell.toString().trim();
        java.util.List<String> formatos = java.util.List.of(
            "yyyy-MM-dd", "dd-MM-yyyy", "yyyy/MM/dd", "dd/MM/yyyy"
        );
        for (String formato : formatos) {
            try {
                java.time.format.DateTimeFormatter input = java.time.format.DateTimeFormatter.ofPattern(formato);
                java.time.LocalDate fecha = java.time.LocalDate.parse(valor, input);
                return fecha.format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE);
            } catch (Exception ignore) {}
        }
        return valor;
    }

    private String formatFechaNacimiento(Cell cell) {
        if (cell == null) return null;
        String valor = cell.toString().trim();
        java.util.List<String> formatos = java.util.List.of(
            "yyyy-MM-dd", "dd-MM-yyyy", "yyyy/MM/dd", "dd/MM/yyyy"
        );
        for (String formato : formatos) {
            try {
                java.time.format.DateTimeFormatter input = java.time.format.DateTimeFormatter.ofPattern(formato);
                java.time.LocalDate fecha = java.time.LocalDate.parse(valor, input);
                // Almacena en formato yyyy-MM-dd estándar para BD
                return fecha.format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE);
            } catch (Exception ignore) {}
        }
        // Si no lo puede parsear, guarda el string tal cual
        return valor;
    }
}



