describe('Casco API Policy Tests', () => {
    it('Create draft of policy', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env('GATEWAY_URL')}/api/casco/policies`,
            headers: { Authorization: Cypress.env('CASCO_API_TOKEN') },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.id).to.be.a('number');
            cy.wrap(response.body.data.id).as('policyId');
        });
    });

    it('Get policy by ID', function () {
        cy.get('@policyId').then((policyId) => {
            cy.request({
                method: 'GET',
                url: `${Cypress.env('GATEWAY_URL')}/api/casco/policies/${policyId}`,
                headers: { Authorization: Cypress.env('CASCO_API_TOKEN') },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.data.id).to.eq(policyId);
            });
        });
    });

    it('Update policy || set', function () {
        cy.get('@policyId').then((policyId) => {
            cy.request({
                method: 'PUT',
                url: `${Cypress.env('GATEWAY_URL')}/api/casco/policies/${policyId}`,
                headers: { Authorization: Cypress.env('CASCO_API_TOKEN') },
                body: {
                    name: 'Updated Policy Name',
                    description: 'Updated policy description',
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.data.name).to.eq('Updated Policy Name');
            });
        });
    });

    it('Policy cancellation', function () {
        cy.get('@policyId').then((policyId) => {
            cy.request({
                method: 'DELETE',
                url: `${Cypress.env('GATEWAY_URL')}/api/casco/policies/${policyId}`,
                headers: { Authorization: Cypress.env('CASCO_API_TOKEN') },
            }).then((response) => {
                expect(response.status).to.eq(204);
            });
        });
    });
});
