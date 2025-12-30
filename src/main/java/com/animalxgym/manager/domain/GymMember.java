package com.animalxgym.manager.domain;

public class GymMember {
    private Long id;
    private String nombre;
    private String correo;
    private String telefono;
    private String genero;
    private Integer edad;
    private String fechaNacimiento;
    private String dni;
    private String estadoCuota;
    private Integer diaPagarCuota;
    private String tipoPago;
    private String cuota;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }
    public String getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(String fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }
    public String getEstadoCuota() { return estadoCuota; }
    public void setEstadoCuota(String estadoCuota) { this.estadoCuota = estadoCuota; }
    public Integer getDiaPagarCuota() { return diaPagarCuota; }
    public void setDiaPagarCuota(Integer diaPagarCuota) { this.diaPagarCuota = diaPagarCuota; }
    public String getTipoPago() { return tipoPago; }
    public void setTipoPago(String tipoPago) { this.tipoPago = tipoPago; }
    public String getCuota() { return cuota; }
    public void setCuota(String cuota) { this.cuota = cuota; }

}
