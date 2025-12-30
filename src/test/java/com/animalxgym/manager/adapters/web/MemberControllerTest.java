package com.animalxgym.manager.adapters.web;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MemberController.class)
public class MemberControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.animalxgym.manager.application.MemberService memberService;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.animalxgym.manager.application.ExcelUploadService excelUploadService;

    @Test
    public void testGetMembersEndpoint() throws Exception {
        org.mockito.Mockito.when(memberService.getAllMembers()).thenReturn(java.util.Collections.emptyList());
        mockMvc.perform(get("/members"))
                .andExpect(status().isOk()); // Este test espera que el endpoint exista y retorne 200 OK
    }
}

