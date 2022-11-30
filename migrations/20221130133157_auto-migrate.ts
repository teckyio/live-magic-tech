import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.raw('alter table `fb_post` add column `skip_time` timestamp null')
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('alter table `fb_post` drop column `skip_time`')
}
