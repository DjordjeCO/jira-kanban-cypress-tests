describe('Jira Kanban Board Test', () => {
    beforeEach(() => {
        cy.visit('https://jira.trungk18.com/project/board');
    });

    /* @TestCaseID: TC-001 @Description: Verify that ticket search works */
    it('should verify ticket search works', () => {
        const searchText = 'What ';
        cy.get('.input').click().type(searchText);
        cy.get('.input').should('have.value', searchText);
        cy.wait(500);
        let totalCount = 0;
        const selectors = [
            ':nth-child(1) > .status-list > .px-3 > .lowercase',
            ':nth-child(2) > .status-list > .px-3 > .lowercase',
            ':nth-child(3) > .status-list > .px-3 > .lowercase',
            ':nth-child(4) > .status-list > .px-3 > .lowercase'
        ];
        selectors.forEach((selector) => {
            cy.get(selector).invoke('text').then((text) => {
                const count = parseInt(text.trim(), 10);
                expect(count).to.be.oneOf([0, 1]);
                totalCount += count;
            });
        });
        cy.wrap(null).should(() => {
            expect(totalCount).to.eq(1);
        });
    });

    /* @TestCaseID: TC-002 @Description: Verify that changing ticket status works */
    it('should verify changing ticket status works', () => {
        cy.get('#Backlog > :nth-child(1) > .issue-wrap > .issue').click();
        cy.wait(1000);
        let C;
        cy.get('issue-status > .ant-dropdown-trigger > .btn').invoke('text').then((text) => {
            C = text.trim();
            cy.log('Initial ticket status (C):', C);
        });
        cy.get('issue-status > .ant-dropdown-trigger > .btn').click();
        cy.wait(1000);
        cy.get('.mt-3 > :nth-child(3)').click();
        cy.wait(1000);
        let D;
        cy.get('issue-status > .ant-dropdown-trigger > .btn').invoke('text').then((text) => {
            D = text.trim();
            cy.log('New ticket status (D):', D);
            expect(C).to.not.equal(D);
        });
        cy.get('issue-status > .ant-dropdown-trigger > .btn').click();
        cy.wait(1000);
        cy.get('.ant-dropdown-menu').contains('Backlog').click();
        cy.wait(1000);
        cy.get('issue-status > .ant-dropdown-trigger > .btn').invoke('text').should('contain', 'Backlog');
    });

    /* @TestCaseID: TC-003 @Description: Verify that changing the reporter works */
    it('should verify changing the reporter works', () => {
        cy.get('#Backlog > :nth-child(3) > .issue-wrap > .issue').click();
        cy.wait(1000);
        let E;
        cy.get('issue-reporter > .ant-dropdown-trigger > .btn').invoke('text').then((text) => {
            E = text.trim();
            cy.log('Initial reporter (E):', E);
        });
        cy.get('issue-reporter > .ant-dropdown-trigger > .btn').click();
        cy.wait(1000);
        cy.get('.ant-dropdown-menu').contains('Captain').click();
        cy.wait(1000);
        let F;
        cy.get('issue-reporter > .ant-dropdown-trigger > .btn').invoke('text').then((text) => {
            F = text.trim();
            cy.log('New reporter (F):', F);
            expect(E).to.not.equal(F);
        });
        cy.get('issue-reporter > .ant-dropdown-trigger > .btn').click();
        cy.wait(1000);
        cy.get('.ant-dropdown-menu').contains('Trung Vo').click();
        cy.wait(1000);
        cy.get('issue-reporter > .ant-dropdown-trigger > .btn').invoke('text').should('contain', 'Trung Vo');
    });

    /* @TestCaseID: TC-004 @Description: Verify that ADD and DELETE assignees works */
    it('should verify add and delete assignees work', () => {
        cy.get('#Selected > :nth-child(2) > .issue-wrap > .issue').click();
        cy.wait(1000);
        cy.get('.ant-dropdown-link').click();
        cy.wait(1000);
        cy.get('.ant-dropdown-menu').contains('Spider Man').click();
        cy.wait(1000);
        cy.get('.md\\:w-5\\/12').should('contain', 'Spider Man');
        cy.get('svg-icon.text-textLight').eq(2).click();
        cy.wait(1000);
        cy.get('.md\\:w-5\\/12').should('not.contain', 'Spider Man');
    });

    /* @TestCaseID: TC-005 @Description: Verify that priority section works */
    it('should verify priority section works', () => {
        cy.get('#Selected > :nth-child(2) > .issue-wrap > .issue').click();
        cy.wait(1000);
        let priorityG;
        cy.get('issue-priority > .ant-dropdown-trigger > .btn')
            .invoke('text')
            .then((text) => {
                priorityG = text.trim();
                cy.get('issue-priority > .ant-dropdown-trigger > .btn').click();
            });
        cy.get('.ant-dropdown > .mt-3 > :nth-child(2)').click();
        cy.wait(1000);
        let priorityH;
        cy.get('issue-priority > .ant-dropdown-trigger > .btn')
            .invoke('text')
            .then((text) => {
                priorityH = text.trim();
                expect(priorityG).not.to.eq(priorityH);
            });
        cy.get('issue-priority > .ant-dropdown-trigger > .btn').click();
        cy.get('.ant-dropdown > .mt-3 > :nth-child(1)').click();
    });

    /* @TestCaseID: TC-06 @Description: Verify that adding comment on ticket works */
    it('should verify adding comment on ticket works', () => {
        cy.get('#InProgress > :nth-child(4) > .issue-wrap > .issue').click();
        cy.get('.editing-area > .cdk-textarea-autosize').click().type('test comment');
        cy.get('.flex > :nth-child(1) > .btn').click();
        cy.wait(1000);
        cy.get('.md\\:w-7\\/12').should('contain', 'test comment');
    });

    /* @TestCaseID: TC-07 @Description: Verify that changing title works */
    it('should verify changing title works', () => {
        cy.get('#Done > :nth-child(2) > .issue-wrap > .issue').click();
        let titleBefore;
        cy.get('issue-title > .cdk-textarea-autosize')
            .invoke('val')
            .then((text) => {
                titleBefore = text;
                cy.get('issue-title > .cdk-textarea-autosize').click().clear().type('Happy birthday');
            });
        cy.get('issue-title > .cdk-textarea-autosize')
            .invoke('val')
            .then((titleAfter) => {
                expect(titleBefore).not.to.eq(titleAfter);
            });
        cy.get('.ng-trigger').click();
        cy.get('[icon="times"] > .btn').click();
        cy.get('.flex-col').should('contain', 'Happy birthday');
    });

    /* @TestCaseID: TC-08 @Description: Verify that user can change the description */
    it('should verify changing the description works', () => {
        cy.get(':nth-child(5) > .issue-wrap > .issue').click();
        cy.get('.ql-editor').click();
        cy.get('.ql-editor').clear();
        cy.get('.ql-editor').type('This is new description');
        cy.get('.mr-2 > .btn').click();
        cy.get('.md\\:w-7\\/12').should('contain', 'This is new description');
    });

    /* @TestCaseID: TC-09 @Description: Verify that user can filter with ignore resolved tickets */
    it('should verify filtering with ignore resolved tickets works', () => {
        cy.get(':nth-child(4) > .status-list > .px-3')
            .invoke('text')
            .should('not.contain', '0');
        cy.get(':nth-child(4) > .btn').click();
        cy.wait(1000);
        cy.get(':nth-child(4) > .status-list > .px-3')
            .invoke('text')
            .should('contain', '0');
    });

    /* @TestCaseID: TC-10 @Description: Verify that changing the ticket type works */
    it('should verify changing the ticket type works', () => {
        cy.get('#Selected > :nth-child(1) > .issue-wrap > .issue').click();
        cy.get('button.btn-empty.icon-only').eq(1).click();
        cy.get('.type-dropdown > .ant-dropdown-trigger > .btn')
            .invoke('text')
            .then((K) => {
                cy.get('.type-dropdown > .ant-dropdown-trigger > .btn').click();
                cy.wait(500);
                cy.get('.ant-dropdown-menu > :nth-child(2)').click();
                cy.wait(500);
                cy.get('.type-dropdown > .ant-dropdown-trigger > .btn')
                    .invoke('text')
                    .then((L) => {
                        expect(K).not.to.eq(L);
                    });
            });
    });
});
