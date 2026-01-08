package com.animalxgym.manager.application;

import com.animalxgym.manager.domain.GymMember;
import com.animalxgym.manager.domain.GymMemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class MemberServiceTest {
    private MemberService memberService;
    private GymMemberRepository gymMemberRepository;

    @BeforeEach
    public void init() {
        gymMemberRepository = Mockito.mock(GymMemberRepository.class);
        memberService = new MemberService(gymMemberRepository);
    }

    @Test
    public void testSaveOrUpdateMember() {
        GymMember member = new GymMember();
        member.setId(1L);
        memberService.saveOrUpdateMember(member);
        verify(gymMemberRepository).saveOrUpdate(member);
    }

    @Test
    public void testGetMemberById() {
        GymMember member = new GymMember();
        member.setId(2L);
        when(gymMemberRepository.findById(2L)).thenReturn(member);
        GymMember found = memberService.getMemberById(2L);
        assertEquals(2L, found.getId());
    }

    @Test
    public void testGetAllMembers() {
        GymMember member1 = new GymMember();
        member1.setId(1L);
        GymMember member2 = new GymMember();
        member2.setId(2L);
        when(gymMemberRepository.findAll()).thenReturn(List.of(member1, member2));
        List<GymMember> members = memberService.getAllMembers();
        assertEquals(2, members.size());
    }
}







