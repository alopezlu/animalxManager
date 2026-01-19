package com.animalxgym.manager.infrastructure.persistence;

import com.animalxgym.manager.domain.GymMember;

public class MemberEntityMapper {
    public static GymMemberEntity toEntity(GymMember domain) {
        GymMemberEntity entity = new GymMemberEntity();
        entity.setId(domain.getId());
        entity.setNombre(domain.getNombre());
        entity.setCorreo(domain.getCorreo());
        entity.setTelefono(domain.getTelefono());
        entity.setGenero(domain.getGenero());
        entity.setEdad(domain.getEdad());
        entity.setFechaNacimiento(domain.getFechaNacimiento());
        entity.setDni(domain.getDni());
        entity.setEstadoCuota(domain.getEstadoCuota());
        entity.setDiaPagarCuota(domain.getDiaPagarCuota());
        entity.setTipoPago(domain.getTipoPago());
        entity.setCuota(domain.getCuota());
        return entity;
    }

    public static GymMember toDomain(GymMemberEntity entity) {
        GymMember domain = new GymMember();
        domain.setId(entity.getId());
        domain.setNombre(entity.getNombre());
        domain.setCorreo(entity.getCorreo());
        domain.setTelefono(entity.getTelefono());
        domain.setGenero(entity.getGenero());
        domain.setEdad(entity.getEdad());
        domain.setFechaNacimiento(entity.getFechaNacimiento());
        domain.setDni(entity.getDni());
        domain.setEstadoCuota(entity.getEstadoCuota());
        domain.setDiaPagarCuota(entity.getDiaPagarCuota());
        domain.setTipoPago(entity.getTipoPago());
        domain.setCuota(entity.getCuota());
        return domain;
    }
}








