import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('fb_user'))) {
    await knex.schema.createTable('fb_user', table => {
      table.increments('id')
      table.text('nickname').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('fb_group'))) {
    await knex.schema.createTable('fb_group', table => {
      table.increments('id')
      table.text('name').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('fb_post'))) {
    await knex.schema.createTable('fb_post', table => {
      table.increments('id')
      table.timestamp('post_time').notNullable()
      table.text('content').notNullable()
      table.integer('fb_user_id').unsigned().notNullable().references('fb_user.id')
      table.integer('fb_group_id').unsigned().notNullable().references('fb_group.id')
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('fb_post')
  await knex.schema.dropTableIfExists('fb_group')
  await knex.schema.dropTableIfExists('fb_user')
}
