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
                    member.setTelefono(getStr(row.getCell(3)));
                    member.setGenero(getStr(row.getCell(4)));
                    member.setEdad(toInt(row.getCell(5)));
                    member.setFechaNacimiento(getStr(row.getCell(6)));
                    member.setDni(getStr(row.getCell(7)));
                    member.setEstadoCuota(getStr(row.getCell(8)));
                    member.setDiaPagarCuota(toInt(row.getCell(9)));
                    member.setTipoPago(getStr(row.getCell(10)));
                    member.setCuota(getStr(row.getCell(11)));
                    GymMember existente = repository.findById(member.getId());
                    if (existente == null) { guardados++; } else { actualizados++; }
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
    private Integer toInt(Cell cell) { if (cell == null) return null; try { return (int) cell.getNumericCellValue(); } catch (Exception e) { return Integer.valueOf(cell.toString().replace(".0", "")); } }
    private Long toLong(Cell cell) { if (cell == null) return null; try { return (long) cell.getNumericCellValue(); } catch (Exception e) { return Long.valueOf(cell.toString().replace(".0", "")); } }
}


