package com.animalxgym.manager.adapters.web;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/members")
public class MemberController {
    private final com.animalxgym.manager.application.MemberService memberService;
    private final com.animalxgym.manager.application.ExcelUploadService excelUploadService;

    public MemberController(com.animalxgym.manager.application.MemberService memberService, com.animalxgym.manager.application.ExcelUploadService excelUploadService) {
        this.memberService = memberService;
        this.excelUploadService = excelUploadService;
    }

    @org.springframework.web.bind.annotation.GetMapping
    public java.util.List<com.animalxgym.manager.domain.GymMember> getAllMembers() {
        return memberService.getAllMembers();
    }

    @org.springframework.web.bind.annotation.PostMapping("/upload")
    public org.springframework.http.ResponseEntity<String> uploadMembersExcel(@org.springframework.web.bind.annotation.RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String resultado = excelUploadService.processExcel(file);
        return org.springframework.http.ResponseEntity.ok(resultado);
    }

    // ENDPOINT TEMPORAL para limpiar todos los miembros (ÚSALO SOLO PARA TESTEO)
    @org.springframework.web.bind.annotation.DeleteMapping("/clear")
    public org.springframework.http.ResponseEntity<Void> clearAllMembers() {
        memberService.deleteAllMembers();
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
