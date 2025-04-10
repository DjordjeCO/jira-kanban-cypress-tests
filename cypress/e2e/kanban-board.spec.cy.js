describe('Jira Kanban Board Test', () => {
    beforeEach(() => {
        cy.visit('https://jira.trungk18.com/project/board');
    });

    /* @TestCaseID: TC-001 @Description: Verify that ticket search works */
    it('should verify ticket search works', () => {
        const searchText = 'What ';

        // 1. Klikni na input polje za pretragu i ukucaj tekst
        cy.log(' 1. Klikni na input polje za pretragu i ukucaj tekst');
        cy.get('.input').click().type(searchText).as('searchInput');

        // 2. Verifikuj da je vrednost input polja odgovarajuća
        cy.log(' 2. Verifikuj da je vrednost input polja odgovarajuća');
        cy.get('@searchInput').should('have.value', searchText);

        cy.wait(500);

        let totalCount = 0;
        const selectors = [
            ':nth-child(1) > .status-list > .px-3 > .lowercase',
            ':nth-child(2) > .status-list > .px-3 > .lowercase',
            ':nth-child(3) > .status-list > .px-3 > .lowercase',
            ':nth-child(4) > .status-list > .px-3 > .lowercase'
        ];

        // 3. Proveri broj tiketa u svakoj koloni
        selectors.forEach((selector, index) => {
            cy.get(selector).invoke('text').then((text) => {
                const count = parseInt(text.trim(), 10);
                cy.log(` 3. Proveri broj tiketa u ${index + 1}. koloni: ${count}`);
                expect(count).to.be.oneOf([0, 1]);
                totalCount += count;
            });
        });

        // 4. Verifikuj da ukupno ima 1 tiket
        cy.log(' 4. Verifikuj da ukupno ima 1 tiket');
        cy.wrap(null).should(() => {
            expect(totalCount).to.eq(1);
        });
    });

    /* @TestCaseID: TC-002 @Description: Verify that changing ticket status works */
    it('should verify changing ticket status works', () => {
        // 1. Otvori prvi tiket iz "Backlog" kolone
        cy.log(' 1. Otvori prvi tiket iz "Backlog" kolone');
        cy.get('#Backlog > :nth-child(1) > .issue-wrap > .issue').click();
        cy.wait(1000);

        let C;
        // 2. Sačuvaj trenutni status tiketa
        cy.log(' 2. Sačuvaj trenutni status tiketa');
        cy.get('issue-status > .ant-dropdown-trigger > .btn').invoke('text').then((text) => {
            C = text.trim();
            cy.log(' Trenutni status tiketa:', C);
        });

        // 3. Promeni status tiketa
        cy.log(' 3. Promeni status tiketa');
        cy.get('issue-status > .ant-dropdown-trigger > .btn').click();
        cy.wait(1000);
        cy.get('.mt-3 > :nth-child(3)').click();
        cy.wait(1000);

        let D;
        // 4. Sačuvaj novi status tiketa
        cy.log(' 4. Sačuvaj novi status tiketa');
        cy.get('issue-status > .ant-dropdown-trigger > .btn').invoke('text').then((text) => {
            D = text.trim();
            cy.log(' Novi status tiketa:', D);
            expect(C).to.not.equal(D);
        });

        // 5. Vratite status tiketa na originalni
        cy.log('🔙 5. Vratite status tiketa na originalni');
        cy.get('issue-status > .ant-dropdown-trigger > .btn').click();
        cy.wait(1000);
        cy.get('.ant-dropdown-menu').contains('Backlog').click();
        cy.wait(1000);
        cy.get('issue-status > .ant-dropdown-trigger > .btn').invoke('text').should('contain', 'Backlog');
    });

    /* @TestCaseID: TC-003 @Description: Verify that changing the reporter works */
    it('should verify changing the reporter works', () => {
        // 1. Otvori treći tiket iz "Backlog" kolone
        cy.log(' 1. Otvori treći tiket iz "Backlog" kolone');
        cy.get('#Backlog > :nth-child(3) > .issue-wrap > .issue').click();
        cy.wait(1000);

        let E;
        // 2. Sačuvaj trenutnog reportera
        cy.log(' 2. Sačuvaj trenutnog reportera');
        cy.get('issue-reporter > .ant-dropdown-trigger > .btn').invoke('text').then((text) => {
            E = text.trim();
            cy.log(' Trenutni reporter:', E);
        });

        // 3. Promeni reportera
        cy.log(' 3. Promeni reportera');
        cy.get('issue-reporter > .ant-dropdown-trigger > .btn').click();
        cy.wait(1000);
        cy.get('.ant-dropdown-menu').contains('Captain').click();
        cy.wait(1000);

        let F;
        // 4. Sačuvaj novog reportera
        cy.log(' 4. Sačuvaj novog reportera');
        cy.get('issue-reporter > .ant-dropdown-trigger > .btn').invoke('text').then((text) => {
            F = text.trim();
            cy.log(' Novi reporter:', F);
            expect(E).to.not.equal(F);
        });

        // 5. Vratite reportera na originalnog
        cy.log(' 5. Vratite reportera na originalnog');
        cy.get('issue-reporter > .ant-dropdown-trigger > .btn').click();
        cy.wait(1000);
        cy.get('.ant-dropdown-menu').contains('Trung Vo').click();
        cy.wait(1000);
        cy.get('issue-reporter > .ant-dropdown-trigger > .btn').invoke('text').should('contain', 'Trung Vo');
    });

    /* @TestCaseID: TC-004 @Description: Verify that ADD and DELETE assignees works */
    it('should verify add and delete assignees work', () => {
        // 1. Otvori drugi tiket iz "Selected" kolone
        cy.log(' 1. Otvori drugi tiket iz "Selected" kolone');
        cy.get('#Selected > :nth-child(2) > .issue-wrap > .issue').click();
        cy.wait(1000);

        // 2. Klikni na dugme za dodavanje novog dodeljenog korisnika
        cy.log(' 2. Klikni na dugme za dodavanje novog dodeljenog korisnika');
        cy.get('.ant-dropdown-link').click();
        cy.wait(1000);

        // 3. Izaberi "Spider Man" sa liste
        cy.log(' 3. Izaberi "Spider Man" sa liste');
        cy.get('.ant-dropdown-menu').contains('Spider Man').click();
        cy.wait(1000);

        // 4. Verifikuj da je "Spider Man" dodeljen
        cy.log(' 4. Verifikuj da je "Spider Man" dodeljen');
        cy.get('.md\\:w-5\\/12').should('contain', 'Spider Man');

        // 5. Klikni na ikonu za brisanje dodeljenog korisnika
        cy.log(' 5. Klikni na ikonu za brisanje dodeljenog korisnika');
        cy.get('svg-icon.text-textLight').eq(2).click();
        cy.wait(1000);

        // 6. Verifikuj da je "Spider Man" uklonjen
        cy.log(' 6. Verifikuj da je "Spider Man" uklonjen');
        cy.get('.md\\:w-5\\/12').should('not.contain', 'Spider Man');
    });

    /* @TestCaseID: TC-005 @Description: Verify that priority section works */
    it('should verify priority section works', () => {
        // 1. Otvori drugi tiket iz "Selected" kolone
        cy.log(' 1. Otvori drugi tiket iz "Selected" kolone');
        cy.get('#Selected > :nth-child(2) > .issue-wrap > .issue').click();
        cy.wait(1000);

        let priorityG;
        // 2. Sačuvaj trenutni prioritet
        cy.log(' 2. Sačuvaj trenutni prioritet');
        cy.get('issue-priority > .ant-dropdown-trigger > .btn')
            .invoke('text')
            .then((text) => {
                priorityG = text.trim();
                cy.log(` Trenutni prioritet: ${priorityG}`);
                cy.get('issue-priority > .ant-dropdown-trigger > .btn').click();
            });

        // 3. Izaberi novi prioritet
        cy.log(' 3. Izaberi novi prioritet');
        cy.get('.ant-dropdown > .mt-3 > :nth-child(2)').click();
        cy.wait(1000);

        let priorityH;
        // 4. Sačuvaj novi prioritet
        cy.log(' 4. Sačuvaj novi prioritet');
        cy.get('issue-priority > .ant-dropdown-trigger > .btn')
            .invoke('text')
            .then((text) => {
                priorityH = text.trim();
                cy.log(` Novi prioritet: ${priorityH}`);
                expect(priorityG).not.to.eq(priorityH);
            });

        // 5. Vratite prioritet na originalni
        cy.log(' 5. Vratite prioritet na originalni');
        cy.get('issue-priority > .ant-dropdown-trigger > .btn').click();
        cy.get('.ant-dropdown > .mt-3 > :nth-child(1)').click();
    });

    /* @TestCaseID: TC-06 @Description: Verify that adding comment on ticket works */
    it('should verify adding comment on ticket works', () => {
        // 1. Otvori četvrti tiket iz "In Progress" kolone
        cy.log(' 1. Otvori četvrti tiket iz "In Progress" kolone');
        cy.get('#InProgress > :nth-child(4) > .issue-wrap > .issue').click();

        // 2. Klikni na textarea za unos komentara i unesite komentar
        cy.log(' 2. Klikni na textarea za unos komentara i unesite komentar');
        cy.get('.editing-area > .cdk-textarea-autosize').click().type('test comment');

        // 3. Klikni na dugme za dodavanje komentara
        cy.log(' 3. Klikni na dugme za dodavanje komentara');
        cy.get('.flex > :nth-child(1) > .btn').click();
        cy.wait(1000);

        // 4. Verifikuj da je komentar sačuvan
        cy.log(' 4. Verifikuj da je komentar sačuvan');
        cy.get('.md\\:w-7\\/12').should('contain', 'test comment');
    });

    /* @TestCaseID: TC-07 @Description: Verify that changing title works */
    it('should verify changing title works', () => {
        // 1. Otvori drugi tiket iz "Done" kolone
        cy.log(' 1. Otvori drugi tiket iz "Done" kolone');
        cy.get('#Done > :nth-child(2) > .issue-wrap > .issue').click();

        let titleBefore;
        // 2. Sačuvaj trenutni naslov tiketa
        cy.log(' 2. Sačuvaj trenutni naslov tiketa');
        cy.get('issue-title > .cdk-textarea-autosize')
            .invoke('val')
            .then((text) => {
                titleBefore = text;
                cy.log(` Trenutni naslov tiketa: ${titleBefore}`);
                cy.get('issue-title > .cdk-textarea-autosize').click().clear().type('Happy birthday');
            });

        // 3. Sačuvaj novi naslov i proveri da su se promenili
        cy.get('issue-title > .cdk-textarea-autosize')
            .invoke('val')
            .then((titleAfter) => {
                cy.log(`✅ Novi naslov tiketa: ${titleAfter}`);
                expect(titleBefore).not.to.eq(titleAfter);
            });

        // 4. Klikni na dugme za potvrdu promene
        cy.log(' 4. Klikni na dugme za potvrdu promene');
        cy.get('.ng-trigger').click();

        // 5. Zatvori tiket
        cy.log(' 5. Zatvori tiket');
        cy.get('[icon="times"] > .btn').click();

        // 6. Verifikuj da je novi naslov sačuvan
        cy.log(' 6. Verifikuj da je novi naslov sačuvan');
        cy.get('.flex-col').should('contain', 'Happy birthday');
    });

    /* @TestCaseID: TC-08 @Description: Verify that user can change the description */
    it('should verify changing the description works', () => {
        // 1. Otvori peti tiket iz "Selected" kolone
        cy.log(' 1. Otvori peti tiket iz "Selected" kolone');
        cy.get(':nth-child(5) > .issue-wrap > .issue').click();

        // 2. Klikni na textarea za unos nove deskripcije
        cy.log(' 2. Klikni na textarea za unos nove deskripcije');
        cy.get('.ql-editor').click();
        cy.get('.ql-editor').clear();
        cy.get('.ql-editor').type('This is new description');

        // 3. Klikni na dugme za potvrdu promene
        cy.log(' 3. Klikni na dugme za potvrdu promene');
        cy.get('.mr-2 > .btn').click();

        // 4. Verifikuj da je nova deskripcija sačuvana
        cy.log(' 4. Verifikuj da je nova deskripcija sačuvana');
        cy.get('.md\\:w-7\\/12').should('contain', 'This is new description');
    });

    /* @TestCaseID: TC-09 @Description: Verify that user can filter with ignore resolved tickets */
    it('should verify filtering with ignore resolved tickets works', () => {
        // 1. Verifikuj da broj tiketa nije 0 u četvrtoj koloni
        cy.log(' 1. Verifikuj da broj tiketa nije 0 u četvrtoj koloni');
        cy.get(':nth-child(4) > .status-list > .px-3')
            .invoke('text')
            .should('not.contain', '0');

        // 2. Klikni na filter za "Resolved"
        cy.log(' 2. Klikni na filter za "Resolved"');
        cy.get(':nth-child(4) > .btn').click();
        cy.wait(1000);

        // 3. Verifikuj da broj tiketa jeste 0 u četvrtoj koloni
        cy.log(' 3. Verifikuj da broj tiketa jeste 0 u četvrtoj koloni');
        cy.get(':nth-child(4) > .status-list > .px-3')
            .invoke('text')
            .should('contain', '0');
    });

    /* @TestCaseID: TC-10 @Description: Verify that changing the ticket type works */
    it('should verify changing the ticket type works', () => {
        // 1. Otvori prvi tiket iz "Selected" kolone
        cy.log(' 1. Otvori prvi tiket iz "Selected" kolone');
        cy.get('#Selected > :nth-child(1) > .issue-wrap > .issue').click();

        // 2. Klikni na dugme za tip tiketa
        cy.log(' 2. Klikni na dugme za tip tiketa');
        cy.get('button.btn-empty.icon-only').eq(1).click();

        // 3. Sačuvaj trenutni tip tiketa
        let K;
        cy.get('.type-dropdown > .ant-dropdown-trigger > .btn')
            .invoke('text')
            .then((text) => {
                K = text.trim();
                cy.log(` Trenutni tip tiketa: ${K}`);
                cy.get('.type-dropdown > .ant-dropdown-trigger > .btn').click();
                cy.wait(500);
            });

        // 4. Izaberi novi tip tiketa
        cy.log(' 4. Izaberi novi tip tiketa');
        cy.get('.ant-dropdown-menu > :nth-child(2)').click();
        cy.wait(500);

        // 5. Sačuvaj novi tip tiketa i proveri promenu
        cy.get('.type-dropdown > .ant-dropdown-trigger > .btn')
            .invoke('text')
            .then((L) => {
                cy.log(` Novi tip tiketa: ${L}`);
                expect(K).not.to.eq(L);
            });
    });
});
