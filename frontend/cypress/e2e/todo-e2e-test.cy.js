/// <reference types="cypress" />
/* global cy */

describe('Todo App - Complete E2E Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    
    cy.contains('Todo App', { timeout: 10000 }).should('be.visible')
  })

  it('should create a todo list', () => {
    const timestamp = Date.now()
    const listTitle = `Test List ${timestamp}`
    
    cy.get('[data-testid="create-new-list-button"]')
      .should('be.visible')
      .should('not.be.disabled')
    
    cy.get('[data-testid="create-new-list-button"]').click()
    
    cy.contains('Create New Todo List').should('be.visible')
    
    cy.get('[data-testid="todo-list-title-input"]').type(listTitle)
    
    cy.get('[data-testid="create-button"]').click()
    
    cy.contains(listTitle, { timeout: 5000 }).should('be.visible')
    
    cy.contains('List created successfully!', { timeout: 3000 }).should('be.visible')
    
    // Verify the card is created
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .should('be.visible')
  })

  it('should add a todo to the list', () => {
    const timestamp = Date.now()
    const listTitle = `Test List ${timestamp}`
    const todoText = 'Buy groceries'
    
    // First create a list
    cy.get('[data-testid="create-new-list-button"]').click()
    cy.get('[data-testid="todo-list-title-input"]').type(listTitle)
    cy.get('[data-testid="create-button"]').click()
    cy.contains(listTitle, { timeout: 5000 }).should('be.visible')
    
    // Add a todo
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .find('[data-testid="add-todo-button"]')
      .click()
    
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .find('[data-testid="todo-title-input"]')
      .type(todoText)
    
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .find('[data-testid="todo-detail-input"]')
      .type('Fresh vegetables and fruits')
    
    cy.focused().blur()
    
    // Verify todo appears
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .should('contain', todoText)

  })

  it('should add multiple todos and track progress correctly', () => {
    const timestamp = Date.now()
    const listTitle = `Multi Todo Test ${timestamp}`
    const firstTodo = 'Buy groceries'
    const secondTodo = 'Walk the dog'
    
    // Create a list
    cy.get('[data-testid="create-new-list-button"]').click()
    cy.get('[data-testid="todo-list-title-input"]').type(listTitle)
    cy.get('[data-testid="create-button"]').click()
    cy.contains(listTitle, { timeout: 5000 }).should('be.visible')
    
    // Add first todo
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .find('[data-testid="add-todo-button"]')
      .click()
    
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .find('[data-testid="todo-title-input"]')
      .type(firstTodo)
    
    cy.focused().blur()
    
    // Verify first todo appears
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .should('contain', firstTodo)
    
    // Add second todo
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .find('[data-testid="add-todo-button"]')
      .click()
    
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .find('[data-testid="todo-title-input"]')
      .type(secondTodo)
    
    cy.focused().blur()
    
    // Verify second todo appears
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .should('contain', secondTodo)
    
    // Check initial progress (0/2)
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .should('contain', '0/2')
    
    // Complete first todo
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .find('input[type="checkbox"]')
      .first()
      .check()
    
    // Check progress (1/2)
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .should('contain', '1/2')
    
    // Complete second todo
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .find('input[type="checkbox"]')
      .last()
      .check()
    
    // Check 100% completion
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .should('contain', '2/2')
    
    cy.contains(/All tasks completed!/i).should('be.visible')
    
    // Now uncheck the second todo to make it incomplete
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .find('input[type="checkbox"]')
      .last()
      .uncheck()
    
    // Verify progress is back to 1/2
    cy.get('[data-testid="todo-card"]')
      .contains(listTitle)
      .parents('[data-testid="todo-card"]')
      .should('contain', '1/2')
    
    // Verify "All tasks completed!" message is gone
    cy.contains(/All tasks completed!/i).should('not.exist')
  })

})
