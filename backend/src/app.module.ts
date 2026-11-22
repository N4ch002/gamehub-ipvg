import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { TorneosModule } from './torneos/torneos.module';
import { EquiposModule } from './equipos/equipos.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { PartidosModule } from './partidos/partidos.module';
import { ResultadosModule } from './resultados/resultados.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuariosModule,
    AuthModule,
    TorneosModule,
    EquiposModule,
    InscripcionesModule,
    PartidosModule,
    ResultadosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}