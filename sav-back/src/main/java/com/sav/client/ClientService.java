package com.sav.client;

import com.sav.common.dto.ClientRequest;
import com.sav.common.dto.ClientResponse;
import com.sav.common.dto.PageResponse;
import com.sav.common.tenant.TenantContext;
import com.sav.company.CompanyEntity;
import com.sav.company.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository  clientRepository;
    private final CompanyRepository companyRepository;

    public PageResponse<ClientResponse> findAll(String search, Pageable pageable) {
        String searchParam = (search != null && !search.isBlank()) ? search : "";
        Long companyId = TenantContext.get();
        return PageResponse.from(
                clientRepository.searchByCompany(companyId, searchParam, pageable).map(this::toResponse));
    }

    public ClientResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public ClientResponse create(ClientRequest request) {
        CompanyEntity company = resolveCurrentCompany();

        ClientEntity client = ClientEntity.builder()
                .nom(request.nom())
                .telephone(request.telephone())
                .email(request.email())
                .adresse(request.adresse())
                .company(company)
                .build();
        return toResponse(clientRepository.save(client));
    }

    public ClientResponse update(Long id, ClientRequest request) {
        ClientEntity client = getOrThrow(id);
        client.setNom(request.nom());
        client.setTelephone(request.telephone());
        client.setEmail(request.email());
        client.setAdresse(request.adresse());
        return toResponse(clientRepository.save(client));
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private ClientEntity getOrThrow(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé : " + id));
    }

    private CompanyEntity resolveCurrentCompany() {
        Long companyId = TenantContext.get();
        if (companyId == null) return null; // SUPER_ADMIN
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Company non trouvée : " + companyId));
    }

    private ClientResponse toResponse(ClientEntity c) {
        return new ClientResponse(c.getId(), c.getNom(), c.getTelephone(),
                c.getEmail(), c.getAdresse(), c.getCreatedAt());
    }
}
